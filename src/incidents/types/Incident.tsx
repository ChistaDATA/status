interface Incident {
    id: number;
    title: string;
    description: string;
    status: string;
    created_at: string;
    closed_at: string;
    labels: string[];
}

export default Incident;
