import axiosInstance from "@/core/intercepter/Intercepter"

interface EvaluateWritingBodyData {
  topic: string;
  writingAssignmentSubmission: string;
}

const aiApis = {
  evaluateWriting: async (data: EvaluateWritingBodyData) => {
    return axiosInstance.post<any>(
      "/ai/evaluate-writing",
      data,
    )
  }
}