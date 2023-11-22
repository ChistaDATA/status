import LogDaySummary from "./LogDaySummary";

interface Service {
    id: number;
    name: string;
    status: string;
    lastLogDate: string;
    logs: LogDaySummary[];
}

export default Service;
