"use client";

import React, { useRef, useEffect, useState, useContext, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    GitBranch,
    Github,
    MessageSquare,
    StepForwardIcon as Progress,
    Star,
    Users,
    CheckCircle2,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress as ProgressBar } from "@/components/ui/progress";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useExpandable } from "@/hooks/use-expandable";
import { debounce } from "lodash";
import { AppContext } from "../app-context";
import moment from "moment";
import { ActivityType, LogsData } from "@/lib/types/common";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import MenuBarChart from "./summary";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import NumberFlow from "@number-flow/react";

type ChartData = { createTime: string } & { [key in ActivityType]: number }


const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    view: {
        label: "Viewers",
        color: "hsl(var(--chart-1))",
    },
    like: {
        label: "Likes",
        color: "hsl(var(--chart-2))",
    },
    comment: {
        label: "Comments",
        color: "hsl(var(--chart-3))",
    },
    gift: {
        label: "Gifts",
        color: "hsl(var(--chart-4))",
    },
    share: {
        label: "Shares",
        color: "hsl(var(--chart-5))",
    },
    social: {
        label: "Followers",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig


export default function ExpandableChart() {
    console.log("is rerender")
    const { isExpanded, toggleExpand, animatedHeight } = useExpandable();
    const contentRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [activeChart, setActiveChart] = useState<string[]>(["like", "comment", "gift"])
    const { logs } = useContext(AppContext)
    const [debouncedLogs, setDebouncedLogs] = useState(logs);
    const debouncedSetLogs = useMemo(
        () => debounce((logs) => setDebouncedLogs(logs), 5000), [logs]);

    useEffect(() => {
        debouncedSetLogs(logs);
    }, [logs, debouncedSetLogs]);
    const removeActiveChart = (val: string) => {
        const temporary = [...activeChart]
        const findIndex = temporary.findIndex(x => x == val)
        if (findIndex === -1) {
            temporary.push(val)
        } else {
            temporary.splice(findIndex, 1)
        }
        setActiveChart(temporary)
    }
    const transformedData = useCallback(() => {
        const countOccurrences = debouncedLogs.reduce((res: { [key: string]: ChartData }, log: LogsData) => {
            const { data, type } = log;
            const { createTime: time, likeCount }: { createTime: string, likeCount: number } = data;
            const createTime = moment(moment.unix(Math.round(parseInt(time) / 1000))).format('hh:mm');
            if (!res[createTime]) {
                res[createTime] = { createTime, gift: 0, view: 0, like: 0, comment: 0, share: 0, social: 0 };
            }
            if (type == ActivityType.LIKE) {
                res[createTime][type as ActivityType] += likeCount
            } else { res[createTime][type as ActivityType]++; }
            return res;
        }, {} as ChartData);

        return (Object.values(countOccurrences) as ChartData[]).map(({ createTime, gift, view, like, comment, share, social }) => ({
            createTime,
            gift,
            view,
            like,
            comment,
            social,
            share
        }));
    }, [debouncedLogs]);
    const lastDate = useCallback(() => {
        const last = debouncedLogs.map((log: LogsData) => {
            const { data } = log
            return parseInt(data.createTime)
        }).sort((a: number, b: number) => a - b)
        return moment(moment.unix(parseInt(last[0]) / 1000)).fromNow()

    }, [debouncedLogs]);
    // TODO Bug - Reproduce: Start - Stop.
    const transformedDataArray = useMemo(() => transformedData(), [transformedData]); // Only depend on transformedData
    const total = useMemo(
        () => ({
            like: transformedDataArray.reduce((acc, curr) => acc + (curr.like as number), 0),
            view: transformedDataArray.reduce((acc, curr) => acc + (curr.view as number), 0),
            comment: transformedDataArray.reduce((acc, curr) => acc + (curr.comment as number), 0),
            gift: transformedDataArray.reduce((acc, curr) => acc + (curr.gift as number), 0),
            share: transformedDataArray.reduce((acc, curr) => acc + (curr.share as number), 0),
            social: transformedDataArray.reduce((acc, curr) => acc + (curr.social as number), 0),
        }),
        [transformedDataArray]
    );

    useEffect(() => {
        const updateWidth = () => {
            if (contentRef.current) {
                setWidth(contentRef.current.offsetWidth);
            }
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => { window.removeEventListener("resize", updateWidth); };
    }, []);

    useEffect(() => {
        if (contentRef.current) {
            animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0);
        }
    }, [isExpanded, animatedHeight]);

    return (
        <Card
            className="w-full transition-all duration-300 hover:shadow-lg h-full pb-0"
        >
            <div className="flex flex-col lg:flex-row justify-around items-center w-full border-b">
                <CardHeader className="space-y-1 p-0 cursor-pointer w-full" onClick={toggleExpand}>
                    <div className="space-y-1 py-5 lg:pl-10 flex flex-col items-center lg:items-start w-full">
                        <h3 className="text-2xl font-semibold">Activity Graph</h3>
                        <span className="text-sm text-muted-foreground">Update in every 5s</span>

                    </div>

                </CardHeader>
                <div className="px-5 py-2"> <MenuBarChart /></div>
            </div>

            <motion.div
                style={{ height: animatedHeight }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden"
            >
                <div ref={contentRef}>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4 pt-2"
                            >
                                <CardContent>
                                    <div className="space-y-4">
                                        <ChartContainer
                                            config={chartConfig}
                                            className="aspect-auto h-[350px] w-full"
                                        >
                                            <AreaChart data={transformedDataArray}>
                                                <defs>
                                                    <linearGradient id="fillView" x1="0" y1="0" x2="0" y2="1">
                                                        <stop
                                                            offset="5%"
                                                            stopColor="var(--color-view)"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="var(--color-view)"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                    <linearGradient id="fillLike" x1="0" y1="0" x2="0" y2="1">
                                                        <stop
                                                            offset="5%"
                                                            stopColor="var(--color-like)"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="var(--color-like)"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                    <linearGradient id="fillSocial" x1="0" y1="0" x2="0" y2="1">
                                                        <stop
                                                            offset="5%"
                                                            stopColor="var(--color-social)"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="var(--color-social)"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                    <linearGradient id="fillComment" x1="0" y1="0" x2="0" y2="1">
                                                        <stop
                                                            offset="5%"
                                                            stopColor="var(--color-comment)"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="var(--color-comment)"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                    <linearGradient id="fillGift" x1="0" y1="0" x2="0" y2="1">
                                                        <stop
                                                            offset="5%"
                                                            stopColor="var(--color-gift)"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="var(--color-gift)"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                    <linearGradient id="fillShare" x1="0" y1="0" x2="0" y2="1">
                                                        <stop
                                                            offset="5%"
                                                            stopColor="var(--color-share)"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="var(--color-share)"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid vertical={false} />
                                                <XAxis
                                                    dataKey="createTime"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={8}
                                                    minTickGap={32}

                                                />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={
                                                        <ChartTooltipContent

                                                            indicator="dot"
                                                        />
                                                    }
                                                />
                                                {(activeChart.includes('view') || activeChart == undefined) && <Area
                                                    dataKey="view"
                                                    type="natural"
                                                    fill="url(#fillView)"
                                                    stroke="var(--color-View)"
                                                    stackId="a"
                                                />}
                                                {(activeChart.includes("like") || activeChart == undefined) && <Area
                                                    dataKey="like"
                                                    type="natural"
                                                    fill="url(#fillLike)"
                                                    stroke="var(--color-like)"
                                                    stackId="a"
                                                />}
                                                {(activeChart.includes("comment") || activeChart == undefined) && <Area
                                                    dataKey="comment"
                                                    type="natural"
                                                    fill="url(#fillComment)"
                                                    stroke="var(--color-comment)"
                                                    stackId="a"
                                                />}
                                                {(activeChart.includes("gift") || activeChart == undefined) && <Area
                                                    dataKey="gift"
                                                    type="natural"
                                                    fill="url(#fillGift)"
                                                    stroke="var(--color-gift)"
                                                    stackId="a"
                                                />}
                                                {(activeChart.includes("share") || activeChart == undefined) && <Area
                                                    dataKey="share"
                                                    type="natural"
                                                    fill="url(#fillShare)"
                                                    stroke="var(--color-share)"
                                                    stackId="a"
                                                />}
                                                {(activeChart.includes("social") || activeChart == undefined) && <Area
                                                    dataKey="social"
                                                    type="natural"
                                                    fill="url(#fillSocial)"
                                                    stroke="var(--color-social  )"
                                                    stackId="a"
                                                />}

                                                <ChartLegend content={<ChartLegendContent />} />
                                            </AreaChart>
                                        </ChartContainer>
                                    </div>

                                </CardContent>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </motion.div>
            <CardFooter className="p-0 w-full">
                <div className="flex flex-col w-full">
                    <div className={`grid grid-cols-2 lg:flex justify-items-stretch w-full border-b ${isExpanded ? `border-t` : `border-t-0`}`}>
                        {["view", "like", "comment", "gift", "share", "social"].map((key, i) => {
                            const chart = key as keyof typeof chartConfig
                            return (
                                <button
                                    disabled={!isExpanded}
                                    key={chart}
                                    data-active={activeChart.includes(chart)}
                                    className="w-full flex flex-1 flex-col items-center justify-center gap-1 border-t px-0 lg:px-6 py-3 lg:py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                    onClick={() => removeActiveChart(key)}
                                >
                                    <span className="text-xs text-muted-foreground">
                                        {chartConfig[chart].label}
                                    </span>
                                    <span className="text-lg font-bold leading-none sm:text-3xl">
                                        <NumberFlow
                                            value={total[key as keyof typeof total]}
                                            transformTiming={{
                                                duration: 500,
                                                easing: "ease-out",
                                            }}
                                        />

                                    </span>
                                </button>
                            )
                        })}
                    </div>
                    <span className="px-3 py-3  text-sm text-muted-foreground">Latest activity at {(debouncedLogs.length > 0) && lastDate()}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
