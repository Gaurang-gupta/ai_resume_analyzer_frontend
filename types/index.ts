export interface AnalysisResult {
    overallScore: number; // 0-100
    summary: string;

    breakdown: {
        skillsMatch: number;      // 0-100
        experienceMatch: number;  // 0-100
        educationMatch: number;   // 0-100
    };

    skills: {
        matched: string[];        // explicitly matched skills
        missing: string[];        // explicitly missing skills
    };

    experience: {
        requiredLevel: string;    // from job description
        inferredLevel: string;    // inferred from resume
        gapReason?: string;       // short explanation if mismatch
    };

    education: {
        meetsRequirement: boolean;
        notes?: string;
    };

    strengths: string[];
    recommendations: string[];
}


export interface FrontEndResumeData {
    id: string;
    filename: string;
    created_at: string;
    analyses: {
        id: string;
        created_at: string;
        result: AnalysisResult
    }[]
}

export interface FrontEndAnalyzeData {
    id: string;
    user_id: string;
    resume_id: string;
    job_title: string;
    job_description: string;
    status: "queued" | "completed" | "failed" | "processing";
    created_at: string;
}

export interface FrontEndFullAnalzeRow {
    id: string;
    user_id: string;
    resume_id: string;
    job_title: string;
    job_description: string;
    status: "queued" | "completed" | "failed" | "processing";
    result: AnalysisResult;
    error_message: string;
    created_at: string;
    started_at: string;
    completed_at: string;
    failed_at: string;
    experience_level: 'student' | '0-2' | '3-5' | '6+' | 'career_switcher'
}

export interface ResumeData {
    id: string,
    user_id : string,
    filename: string,
    storage_path: string,
    created_at: string,
}