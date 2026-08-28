import { HiChatBubbleLeftRight } from "react-icons/hi2"
import { IoEarth } from "react-icons/io5"
import { FaPhoneAlt } from "react-icons/fa"
import ContactForm from "../components/core/Contact/ContactForm"

const CHANNELS = [
  {
    icon: HiChatBubbleLeftRight,
    title: "Chat on us",
    lines: ["Our friendly team is here to help.", "info@studynotion.com"],
  },
  {
    icon: IoEarth,
    title: "Visit us",
    lines: ["Come and say hello at our office HQ.", "Here is the location/ address"],
  },
  {
    icon: FaPhoneAlt,
    title: "Call us",
    lines: ["Mon - Fri From 8am to 5pm", "+123 456 7890"],
  },
]

function Contact() {
  return (
    <div className="mx-auto w-11/12 max-w-maxContent py-16 text-richblack-5">
      <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
        {/* Channels */}
        <aside className="h-fit rounded-xl bg-richblack-800 p-6 lg:w-[400px]">
          {CHANNELS.map((channel) => (
            <div key={channel.title} className="mb-8 last:mb-0">
              <div className="flex items-center gap-x-3">
                <channel.icon size={20} className="text-richblack-100" />
                <p className="text-[1.063rem] font-semibold">{channel.title}</p>
              </div>
              {channel.lines.map((line) => (
                <p
                  key={line}
                  className="ml-8 text-[0.875rem] text-richblack-200"
                >
                  {line}
                </p>
              ))}
            </div>
          ))}
        </aside>

        {/* Form */}
        <section className="flex-1 rounded-xl border border-richblack-600 p-8 lg:p-12">
          <h1 className="text-[2.25rem] font-semibold leading-[2.75rem]">
            Got a Idea? We&apos;ve got the skills. Let&apos;s team up
          </h1>
          <p className="mt-3 text-[0.938rem] text-richblack-300">
            Tell us more about yourself and what you&apos;ve got in mind.
          </p>

          <div className="mt-8">
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  )
}

export default Contact
