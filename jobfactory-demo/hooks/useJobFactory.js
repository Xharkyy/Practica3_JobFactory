"use client";

import { useState, useEffect } from "react";
import { 
  getJobsCountAction,
  postJobAction,
  acceptJobAction
} from "../actions/jobFactoryActions";

export function useJobFactory() {
  const [jobsCount, setJobsCount] = useState(0);

  async function refresh() {
    const count = await getJobsCountAction();
    setJobsCount(count);
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    jobsCount,
    refresh,
    postJob: postJobAction,
    acceptJob: acceptJobAction,
  };
}