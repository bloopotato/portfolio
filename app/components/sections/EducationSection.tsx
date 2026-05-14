"use client";

import { useState, useRef } from "react";
import { GoBriefcase } from "react-icons/go";
import { FaCirclePlay, FaDownload, FaTableTennisPaddleBall } from "react-icons/fa6";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { IoSchoolOutline, IoCameraOutline } from "react-icons/io5";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { BiMath } from "react-icons/bi";

type ActivityItem = {
  id: string;
  title: string;
  date: string;
  desc: string;
  icon?: React.ReactNode;
};

type EducationItem = {
  id: string;
  icon: React.ReactNode;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: ActivityItem[];
};

const EDUCATION_ITEMS: EducationItem[] = [
  {
    id: "ntu",
    icon: <IoSchoolOutline />,
    institution: "Nanyang Technological University",
    degree:
      "Bachelor of Engineering (Computer Engineering) & Bachelor of Business (Business Analytics)",
    startDate: "Aug 2023",
    endDate: "May 2027 (expected)",
    description: [
      {
        id: "naat-club",
        title: "NBS Accounting and Assurance Team Deputy Logistics Director",
        date: "Aug 2024 - Aug 2025",
        desc: "Assisted in planning and coordination of logistics for events and conducted audits for various clubs, reviewing their financial records",
      },
      {
        id: "hall-6-captain",
        title: "Hall 6 Table Tennis Captain",
        date: "Aug 2024 - Aug 2025",
        desc: "Organised and conducted regular training sessions, and led the team to participate in inter-hall tournaments",
        icon: <FaTableTennisPaddleBall className="text-2xl" />,
      },
      {
        id: "scse-club",
        title: "SCSE Club Publicity and Publications Member",
        date: "Oct 2023 - Sep 2024",
        desc: "Contributed to the design of event collaterals and creation of media for the platforms that the sub-committee manages",
        icon: <IoCameraOutline className="text-2xl" />,
      },
    ],
  },
  {
    id: "hwachong",
    icon: <IoSchoolOutline />,
    institution: "Hwa Chong Junior College",
    degree: "A Levels",
    startDate: "2021",
    endDate: "2022",
    description: [
      {
        id: "table-tennis",
        title: "Table Tennis Club Member",
        date: "2021 - 2022",
        desc: "",
        icon: <FaTableTennisPaddleBall className="text-2xl" />,
      },
      {
        id: "math",
        title: "HCI Math Clinic Volunteer",
        date: "Jun 2022 - Aug 2022",
        desc: "Volunteered to tutor other students in Mathematics",
        icon: <BiMath className="text-2xl" />,
      },
    ],
  },
];

export function EducationSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const allActivities = EDUCATION_ITEMS.flatMap((item) => item.description);
  const selectedIndex = selectedActivity
    ? allActivities.findIndex((item) => item.id === selectedActivity.id)
    : -1;

  const handlePreviousActivity = () => {
    if (selectedIndex <= 0) return;
    setSelectedActivity(allActivities[selectedIndex - 1]);
  };

  const handleNextActivity = () => {
    if (selectedIndex < 0 || selectedIndex >= allActivities.length - 1) return;
    setSelectedActivity(allActivities[selectedIndex + 1]);
  };

  return (
    <div className="h-full overflow-hidden bg-surface-1 flex flex-col">
      {/* Fixed Header */}
      <div className="border-b border-border-theme bg-surface-2 px-4 py-2 relative z-20">
        <h2 className="text-2xl font-bold">Yu Hui</h2>
      </div>
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto relative pb-20">
        {EDUCATION_ITEMS.map((item) => (
          <div key={item.id} data-education-item={item.id} className="p-4">
            {/* Institution Card */}
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-30 h-30 border-2 border-border-theme rounded-lg text-4xl text-primary shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{item.institution}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.degree}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  {item.startDate} - {item.endDate}
                </p>
                {/* Action Buttons */}
                <div className="flex items-center gap-6">
                  <button type="button" className="flex items-center justify-center">
                    <FaCirclePlay className="text-2xl" />
                  </button>
                  <button type="button" className="flex items-center justify-center">
                    <FaDownload className="text-xl" />
                  </button>
                  <button type="button" className="flex items-center justify-center">
                    <HiEllipsisHorizontal className="text-2xl" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 px-2 pb-2 text-xs text-muted-foreground border-b">
              <span className="flex h-4 w-4 items-center justify-center">#</span>
              <p className="flex-1">Activities</p>
              <p className="w-[20ch] shrink-0">Date</p>
            </div>
            {/* Description List */}
            {item.description.map((desc, index) => (
              <div
                key={desc.id}
                onClick={() => setSelectedActivity(desc)}
                className="flex items-center gap-4 p-2 hover:bg-surface-2 rounded transition cursor-pointer group"
              >
                <span className="flex h-4 w-4 items-center justify-center text-sm text-muted-foreground group-hover:hidden">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedActivity(desc)}
                  className="hidden h-4 w-4 items-center justify-center text-primary hover:opacity-70 group-hover:flex"
                >
                  <FaCirclePlay className="text-sm" />
                </button>
                <span className="flex-1 min-w-0 text-sm leading-none">{desc.title}</span>
                <span className="w-[20ch] shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                  {desc.date}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Music Player Footer (Spotify-style) */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-2">
        {/* Progress Bar */}
        <div className="group relative w-full cursor-pointer">
          <div className="h-1 w-full bg-foreground/20" />
          <div className="absolute left-0 top-0 h-1 w-[35%] bg-foreground transition-all duration-200">
            <div className="absolute right-0 top-1/2 hidden h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-foreground group-hover:block" />
          </div>
        </div>
        {/* Main Content */}
        <div className="flex items-center gap-4 px-4 py-2">
          {/* Album Art */}
          <div className="w-14 h-14 bg-surface-1 border-2 border-border-theme rounded shrink-0 flex items-center justify-center">
            {selectedActivity?.icon || <GoBriefcase className="text-primary text-2xl" />}
          </div>

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            {selectedActivity ? (
              <>
                <p className="text-sm font-semibold truncate">{selectedActivity.title}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {selectedActivity.desc || "No description available"}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No activity selected</p>
            )}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handlePreviousActivity}
              disabled={selectedIndex <= 0}
              className="flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
            >
              <MdSkipPrevious className="text-lg" />
            </button>
            <button type="button" className="flex items-center justify-center">
              <FaCirclePlay className="text-lg" />
            </button>
            <button
              type="button"
              onClick={handleNextActivity}
              disabled={selectedIndex < 0 || selectedIndex >= allActivities.length - 1}
              className="flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
            >
              <MdSkipNext className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
