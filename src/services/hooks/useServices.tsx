import {useState, useEffect} from "react";
import Service from '../types/Service';
import LogDaySummary from "../types/LogDaySummary";
import {Status} from "../../utils/constants";
import SystemStatus from "../types/SystemStatus";

function useServices() {
    const [data, setData] = useState<Service[]>([]);
    const [systemStatus, setSystemStatus] = useState<SystemStatus>({datetime: "", status: "", title: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const metrics = await fetchMetrics();
                setData(metrics as Service[]);

                if (metrics.every((metric) => metric.status === Status.OPERATIONAL)) {
                    setSystemStatus({
                        title: "All System Operational",
                        status: Status.OPERATIONAL,
                        datetime: metrics[0].lastLogDate
                    } as SystemStatus);
                } else if (metrics.every((metric) => metric.status === Status.OUTAGE)) {
                    setSystemStatus({
                        title: "Outage",
                        status: Status.OUTAGE,
                        datetime: metrics[0].lastLogDate
                    } as SystemStatus);
                } else if (metrics.every((metric) => metric.status === Status.PARTIAL_OUTAGE)) {
                    setSystemStatus({
                        title: "Partial Outage",
                        status: Status.PARTIAL_OUTAGE,
                        datetime: metrics[0].lastLogDate
                    } as SystemStatus);
                } else {
                    setSystemStatus({
                        title: "Unknown",
                        status: Status.UNKNOWN,
                        datetime: metrics[0].lastLogDate
                    } as SystemStatus);
                }
            } catch (e: any) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    return [data, systemStatus, isLoading, error];
}

async function fetchMetrics(): Promise<Service[]> {
    let now = new Date().toISOString();
    let ninetyDays = 7776000000;
    let startTime = new Date(Date.now() - ninetyDays).toISOString();
    let prometheusQuery = `%281-avg_over_time%28probe_success%5B1d%5D%29%29*86400`
    const response = await fetch(`${window.api_host}/api/v1/query_range?query=${prometheusQuery}&start=${startTime}&end=${now}&step=86400`);

    let urlMapping = new Map();
    urlMapping.set("https://dev.cloud.chistadata.io", "HomePage");
    urlMapping.set("https://portal.dev.cloud.chistadata.io", "Portal");
    urlMapping.set("https://control-plane.dev.cloud.chistadata.io/health", "ControlPlane");
    urlMapping.set("https://auth.dev.cloud.chistadata.io", "Authentication");
    urlMapping.set("https://keycloak.dev.cloud.chistadata.io", "Keycloak");
    urlMapping.set("https://docs.dev.cloud.chistadata.io", "Docs");

    const text = await response.text();
    const responseObject = JSON.parse(text);
    const services: Service[] = []
    let index = 0;

    responseObject.data.result.forEach((result: any) => {
        const logDaySummary: LogDaySummary[] = [];

        if (urlMapping.has(result.metric.instance)) {

            result.values.forEach((day: any) => {
                let date = new Date(0);
                date.setUTCSeconds(day[0]);
                let secondsOfDowntime = day[1];

                let status = ""
                if (secondsOfDowntime === "0") {
                    status = Status.OPERATIONAL
                } else if (secondsOfDowntime > 3600) {
                    status = Status.OUTAGE
                } else {
                    status = Status.PARTIAL_OUTAGE
                }

                logDaySummary.push({
                    date: date.toISOString().slice(0, 10),
                    dateTime: date.toISOString(),
                    status: status
                })
            })

            services.push({
                id: index,
                name: urlMapping.get(result.metric.instance),
                status: logDaySummary[logDaySummary.length - 1].status,
                lastLogDate: logDaySummary[logDaySummary.length - 1].dateTime,
                logs: logDaySummary
            })
            index++;
        }
    });

    return services;
}

export default useServices;
