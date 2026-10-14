import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  donors,
  ngos,
  distanceKm,
  initialPosts,
  initialJobs,
  activityFeedSeed,
} from '../data/mockData';
import {
  CATEGORIES,
  STATUS,
} from '../utils/constants';
import { computeDecayIndex, urgencyBand } from '../utils/decay';
import { computePriority } from '../utils/priority';
import { computeFHRI } from '../utils/fhri';
import { useToast } from '../components/ui/Toast';

const AppContext = createContext(null);

const initialState = {
  role: null,
  currentDonorId: "d1",
  currentNgoId: "n1",
  ambientTemp: 32,
  timeOffsetHours: 0,
  posts: initialPosts.map((p) => ({ ...p })),
  jobs: initialJobs.map((j) => ({ ...j, postIds: [...j.postIds] })),
  ngoHeadcount: { n1: 50, n2: 120, n3: 35, n4: 80 },
  activity: [...activityFeedSeed],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'SET_DONOR':
      return { ...state, currentDonorId: action.payload };

    case 'SET_AMBIENT_TEMP':
      return { ...state, ambientTemp: action.payload };

    case 'ADVANCE_TIME':
      return { ...state, timeOffsetHours: state.timeOffsetHours + action.payload };

    case 'SET_HEADCOUNT': {
      const { ngoId, count } = action.payload;
      return {
        ...state,
        ngoHeadcount: {
          ...state.ngoHeadcount,
          [ngoId]: Math.max(1, Math.min(500, count)),
        },
      };
    }

    case 'ADD_POST':
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };

    case 'UPDATE_POST_STATUS': {
      const { postId, status } = action.payload;
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === postId ? { ...p, status } : p
        ),
      };
    }

    case 'CLAIM_POST': {
      const { newJob, postId, ngoId } = action.payload;
      return {
        ...state,
        jobs: [...state.jobs, newJob],
        posts: state.posts.map((p) =>
          p.id === postId
            ? { ...p, status: STATUS.CLAIMED, claimedBy: ngoId, jobId: newJob.id }
            : p
        ),
      };
    }

    case 'ACCEPT_JOB': {
      const { jobId } = action.payload;
      return {
        ...state,
        jobs: state.jobs.map((j) =>
          j.id === jobId ? { ...j, driverId: "dr1" } : j
        ),
      };
    }

    case 'PICKUP_POST': {
      const { postId, setInTransit, jobId } = action.payload;
      const updatedPosts = state.posts.map((p) => {
        if (p.id === postId) {
          return { ...p, pickedUp: true, status: setInTransit ? STATUS.IN_TRANSIT : p.status };
        }
        if (setInTransit && p.jobId === jobId && p.status !== STATUS.EXPIRED_AUTOMATED_PURGE) {
          return { ...p, status: STATUS.IN_TRANSIT };
        }
        return p;
      });

      const updatedJobs = state.jobs.map((j) =>
        j.id === jobId && setInTransit ? { ...j, status: STATUS.IN_TRANSIT } : j
      );

      return {
        ...state,
        posts: updatedPosts,
        jobs: updatedJobs,
      };
    }

    case 'VERIFY_DROPOFF': {
      const { jobId } = action.payload;
      const targetJob = state.jobs.find((j) => j.id === jobId);
      if (!targetJob) return state;

      return {
        ...state,
        jobs: state.jobs.map((j) =>
          j.id === jobId ? { ...j, status: STATUS.DELIVERED_VERIFIED } : j
        ),
        posts: state.posts.map((p) =>
          targetJob.postIds.includes(p.id) && p.status !== STATUS.EXPIRED_AUTOMATED_PURGE
            ? { ...p, status: STATUS.DELIVERED_VERIFIED }
            : p
        ),
      };
    }

    case 'AUTO_PURGE_POSTS': {
      const { purgedIds } = action.payload;
      return {
        ...state,
        posts: state.posts.map((p) =>
          purgedIds.includes(p.id)
            ? { ...p, status: STATUS.EXPIRED_AUTOMATED_PURGE }
            : p
        ),
      };
    }

    case 'RESET_DEMO':
      return {
        role: state.role,
        currentDonorId: "d1",
        currentNgoId: "n1",
        ambientTemp: 32,
        timeOffsetHours: 0,
        posts: initialPosts.map((p) => ({ ...p })),
        jobs: initialJobs.map((j) => ({ ...j, postIds: [...j.postIds] })),
        ngoHeadcount: { n1: 50, n2: 120, n3: 35, n4: 80 },
        activity: [...activityFeedSeed],
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { addToast } = useToast();

  // Helper lookups
  const getDonor = useCallback((id) => donors.find((d) => d.id === id), []);
  const getNgo = useCallback((id) => ngos.find((n) => n.id === id), []);
  const getFhri = useCallback((donorId) => {
    const donor = donors.find((d) => d.id === donorId);
    return donor ? computeFHRI(donor.fhriInputs) : 0;
  }, []);

  const getElapsed = useCallback(
    (post) => post.prepHoursAgo + state.timeOffsetHours,
    [state.timeOffsetHours]
  );

  const getDecay = useCallback(
    (post) => {
      const cat = CATEGORIES[post.category] || CATEGORIES.cooked;
      return computeDecayIndex({
        elapsedHours: getElapsed(post),
        tMax: cat.tMax,
        alpha: cat.alpha,
        ambientTemp: state.ambientTemp,
      });
    },
    [getElapsed, state.ambientTemp]
  );

  const getBand = useCallback(
    (post) => urgencyBand(getDecay(post)),
    [getDecay]
  );

  const getPriorityFor = useCallback(
    (post, ngoId) => {
      const dist = distanceKm[post.donorId]?.[ngoId] || 2;
      const decay = getDecay(post);
      const headcount = state.ngoHeadcount[ngoId] || 50;
      return computePriority({
        distanceKm: dist,
        decayIndex: decay,
        headcount,
        meals: post.meals,
      });
    },
    [getDecay, state.ngoHeadcount]
  );

  const bestNgoFor = useCallback(
    (post) => {
      const verifiedNgos = ngos.filter((n) => n.verification === "VERIFIED");
      let best = verifiedNgos[0];
      let maxP = -1;
      for (const ngo of verifiedNgos) {
        const p = getPriorityFor(post, ngo.id);
        if (p > maxP) {
          maxP = p;
          best = ngo;
        }
      }
      return { ngo: best, priority: maxP };
    },
    [getPriorityFor]
  );

  // Safety Intercept effect: Auto-purge posts when Di >= 1.0
  useEffect(() => {
    const purgeEligibleStatuses = [
      STATUS.POSTED,
      STATUS.ALGORITHMICALLY_MATCHED,
      STATUS.CLAIMED,
    ];

    const toPurge = state.posts.filter((p) => {
      if (!purgeEligibleStatuses.includes(p.status)) return false;
      const di = getDecay(p);
      return di >= 1.0;
    });

    if (toPurge.length > 0) {
      const purgedIds = toPurge.map((p) => p.id);
      dispatch({ type: 'AUTO_PURGE_POSTS', payload: { purgedIds } });
      toPurge.forEach((p) => {
        addToast(`⛔ ${p.title} auto-purged (Dᵢ ≥ 1.0)`, 'danger');
      });
    }
  }, [state.ambientTemp, state.timeOffsetHours, state.posts, getDecay, addToast]);

  // Actions
  const createPost = useCallback(
    ({ category, title, weightKg, prepHoursAgo, kitRequested }) => {
      const cat = CATEGORIES[category] || CATEGORIES.cooked;
      const meals = Math.round(weightKg * cat.mealsPerKg);
      const newId = 'p' + (Date.now() % 100000);
      const pickupOtp = String(Math.floor(1000 + Math.random() * 9000));

      const newPost = {
        id: newId,
        donorId: state.currentDonorId,
        category,
        title,
        weightKg: Number(weightKg),
        meals,
        prepHoursAgo: Number(prepHoursAgo) - state.timeOffsetHours, // so elapsed starts at prepHoursAgo
        status: STATUS.POSTED,
        pickupOtp,
        claimedBy: null,
        jobId: null,
        pickedUp: false,
        kitRequested: Boolean(kitRequested),
      };

      dispatch({ type: 'ADD_POST', payload: newPost });
      addToast('Posted! Finding the best match…', 'info');

      // After 3 seconds, match algorithmically
      setTimeout(() => {
        const { ngo, priority } = bestNgoFor(newPost);
        dispatch({
          type: 'UPDATE_POST_STATUS',
          payload: { postId: newId, status: STATUS.ALGORITHMICALLY_MATCHED },
        });
        addToast(
          `Matched with ${ngo.name} (P = ${priority.toFixed(2)})`,
          'success'
        );
      }, 3000);

      return newId;
    },
    [state.currentDonorId, state.timeOffsetHours, bestNgoFor, addToast]
  );

  const claimPost = useCallback(
    (postId, ngoId) => {
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return false;
      const band = getBand(post);
      if (
        (post.status !== STATUS.POSTED &&
          post.status !== STATUS.ALGORITHMICALLY_MATCHED) ||
        band === 'expired'
      ) {
        return false;
      }

      const jobId = 'j' + (state.jobs.length + 1);
      const dropoffOtp = String(Math.floor(1000 + Math.random() * 9000));
      const dist = distanceKm[post.donorId]?.[ngoId] || 3;
      const routeKm = Number((dist + 2).toFixed(1));

      const newJob = {
        id: jobId,
        postIds: [postId],
        ngoId,
        driverId: null,
        status: STATUS.CLAIMED,
        dropoffOtp,
        routeKm,
      };

      dispatch({
        type: 'CLAIM_POST',
        payload: { newJob, postId, ngoId },
      });
      addToast('🔒 Batch locked! Driver will be dispatched.', 'success');
      return true;
    },
    [state.posts, state.jobs.length, getBand, addToast]
  );

  const acceptJob = useCallback(
    (jobId) => {
      dispatch({ type: 'ACCEPT_JOB', payload: { jobId } });
      addToast('Job accepted! Route assigned to Ravi Kumar.', 'success');
    },
    [addToast]
  );

  const verifyPickup = useCallback(
    (jobId, postId, code) => {
      const post = state.posts.find((p) => p.id === postId);
      const job = state.jobs.find((j) => j.id === jobId);
      if (!post || !job) return false;

      if (code !== post.pickupOtp) {
        return false;
      }

      // Check if all non-expired posts of this job are now picked up
      const nonExpiredJobPosts = state.posts.filter(
        (p) => job.postIds.includes(p.id) && p.status !== STATUS.EXPIRED_AUTOMATED_PURGE
      );
      const allPickedUpNow = nonExpiredJobPosts.every(
        (p) => p.id === postId || p.pickedUp
      );

      dispatch({
        type: 'PICKUP_POST',
        payload: { postId, setInTransit: allPickedUpNow, jobId },
      });

      if (allPickedUpNow) {
        addToast('All stops picked up! Ready for delivery.', 'success');
      } else {
        addToast(`Pickup confirmed for ${post.title}`, 'success');
      }

      return true;
    },
    [state.posts, state.jobs, addToast]
  );

  const verifyDropoff = useCallback(
    (jobId, code) => {
      const job = state.jobs.find((j) => j.id === jobId);
      if (!job || job.status !== STATUS.IN_TRANSIT) return false;

      if (code !== job.dropoffOtp) {
        return false;
      }

      dispatch({ type: 'VERIFY_DROPOFF', payload: { jobId } });
      addToast('🎉 Delivery verified! Transfer complete.', 'success');
      return true;
    },
    [state.jobs, addToast]
  );

  const setAmbientTemp = useCallback((n) => {
    dispatch({ type: 'SET_AMBIENT_TEMP', payload: Number(n) });
  }, []);

  const advanceTime = useCallback((hours) => {
    dispatch({ type: 'ADVANCE_TIME', payload: Number(hours) });
  }, []);

  const setHeadcount = useCallback((ngoId, n) => {
    dispatch({ type: 'SET_HEADCOUNT', payload: { ngoId, count: Number(n) } });
  }, []);

  const setCurrentDonor = useCallback((id) => {
    dispatch({ type: 'SET_DONOR', payload: id });
  }, []);

  const resetDemo = useCallback(() => {
    dispatch({ type: 'RESET_DEMO' });
    addToast('Demo reset', 'info');
  }, [addToast]);

  const setRole = useCallback((role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  }, []);

  const value = {
    ...state,
    getDonor,
    getNgo,
    getFhri,
    getElapsed,
    getDecay,
    getBand,
    getPriorityFor,
    bestNgoFor,
    createPost,
    claimPost,
    acceptJob,
    verifyPickup,
    verifyDropoff,
    setAmbientTemp,
    advanceTime,
    setHeadcount,
    setCurrentDonor,
    resetDemo,
    setRole,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
