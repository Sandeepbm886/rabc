"use client"
import MeetingTypeList from "../../../../components/MeetingTypeList";
import { useGetCalls } from "../../hooks/useGetCalls";

function Home() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const date = (new Intl.DateTimeFormat('en-IN', { dateStyle: 'full' })).format(now);
  const { upcomingCalls = [] } = useGetCalls();
  const nextMeeting = upcomingCalls.length > 0 ? upcomingCalls[0] : null;
  const nextMeetingDateTime = nextMeeting?.state?.startsAt
  ? new Date(nextMeeting.state.startsAt).toLocaleString("en-IN", {
      weekday: "short",   // e.g. "Tuesday"
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  : null;


  return (
    <section className='flex size-full flex-col gap-10 text-black'>
      <div className="h-[300px] w-full rounded-[20px] bg-hero">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[370px] rounded py-2 text-center text-base font-normal text-white">
            {nextMeetingDateTime
              ? `Upcoming Meeting at: ${nextMeetingDateTime}`
              : "No upcoming meetings"}
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl text-white">{time}</h1>
            <p className="text-lg font-medium text-sky lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  )
}

export default Home