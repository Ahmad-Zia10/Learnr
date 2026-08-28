import HighlightText from "../components/core/Home/HighlightText"
import ContactForm from "../components/core/Contact/ContactForm"
import aboutus1 from "../assets/Images/aboutus1.webp"
import aboutus2 from "../assets/Images/aboutus2.webp"
import aboutus3 from "../assets/Images/aboutus3.webp"
import foundingStory from "../assets/Images/FoundingStory.png"

const STATS = [
  { count: "5K", label: "Active Students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Courses" },
  { count: "50+", label: "Awards" },
]

function About() {
  return (
    <div className="text-richblack-5">
      {/* Hero */}
      <section className="bg-richblack-800">
        <div className="mx-auto w-11/12 max-w-maxContent pt-16 pb-24 text-center">
          <p className="text-[0.875rem] text-richblack-300">About us</p>
          <h1 className="mx-auto mt-4 max-w-[900px] text-[2.25rem] font-semibold leading-[2.75rem]">
            Driving Innovation in Online Education for a{" "}
            <HighlightText text="Brighter Future" />
          </h1>
          <p className="mx-auto mt-4 max-w-[720px] text-[0.938rem] text-richblack-300">
            Studynotion is at the forefront of driving innovation in online
            education. We&apos;re passionate about creating a brighter future by
            offering cutting-edge courses, leveraging emerging technologies, and
            nurturing a vibrant learning community.
          </p>
        </div>
      </section>

      {/* Overlapping image strip */}
      <section className="mx-auto -mt-16 flex w-11/12 max-w-maxContent justify-center gap-4">
        {[aboutus1, aboutus2, aboutus3].map((image, index) => (
          <img
            key={index}
            src={image}
            alt=""
            className="h-[130px] w-full max-w-[320px] rounded-sm object-cover sm:h-[220px]"
            loading="lazy"
          />
        ))}
      </section>

      {/* Quote */}
      <section className="mx-auto w-11/12 max-w-maxContent py-20">
        <p className="mx-auto max-w-[1000px] text-center text-[1.75rem] font-semibold leading-[2.5rem]">
          We are passionate about revolutionizing the way we learn. Our
          innovative platform{" "}
          <HighlightText text="combines technology" />,{" "}
          <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text font-bold text-transparent">
            expertise
          </span>
          , and community to create an{" "}
          <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] bg-clip-text font-bold text-transparent">
            unparalleled educational experience
          </span>
          .
        </p>
      </section>

      {/* Founding story */}
      <section className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-12 border-t border-richblack-700 py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:w-[48%]">
          <h2 className="bg-gradient-to-b from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-[1.75rem] font-semibold text-transparent">
            Our Founding Story
          </h2>
          <p className="mt-4 text-[0.938rem] text-richblack-300">
            Our e-learning platform was born out of a shared vision and passion
            for transforming education. It all began with a group of educators,
            technologists, and lifelong learners who recognized the need for
            accessible, flexible, and high-quality learning opportunities in a
            rapidly evolving digital world.
          </p>
          <p className="mt-4 text-[0.938rem] text-richblack-300">
            As experienced educators ourselves, we witnessed firsthand the
            limitations and challenges of traditional education systems. We
            believed that education should not be confined to the walls of a
            classroom or restricted by geographical boundaries.
          </p>
        </div>

        <img
          src={foundingStory}
          alt="Our founding story"
          className="lg:w-[45%]"
          loading="lazy"
        />
      </section>

      {/* Vision & mission */}
      <section className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-12 pb-20 lg:flex-row lg:justify-between">
        <div className="lg:w-[45%]">
          <h2 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-[1.75rem] font-semibold text-transparent">
            Our Vision
          </h2>
          <p className="mt-4 text-[0.938rem] text-richblack-300">
            With this vision in mind, we set out on a journey to create an
            e-learning platform that would revolutionize the way people learn.
            Our team of dedicated experts worked tirelessly to develop a robust
            and intuitive platform that combines cutting-edge technology with
            engaging content.
          </p>
        </div>

        <div className="lg:w-[45%]">
          <h2 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-[1.75rem] font-semibold text-transparent">
            Our Mission
          </h2>
          <p className="mt-4 text-[0.938rem] text-richblack-300">
            Our mission goes beyond just delivering courses online. We wanted to
            create a vibrant community of learners, where individuals can
            connect, collaborate, and learn from one another. We foster this
            spirit of collaboration through forums, live sessions, and
            networking opportunities.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-richblack-800">
        <div className="mx-auto grid w-11/12 max-w-maxContent grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[1.875rem] font-bold">{stat.count}</p>
              <p className="mt-1 text-[0.875rem] text-richblack-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Get in touch */}
      <section className="mx-auto w-11/12 max-w-[700px] py-20">
        <h2 className="text-center text-[1.875rem] font-semibold">
          Get in Touch
        </h2>
        <p className="mt-2 text-center text-[0.938rem] text-richblack-300">
          We&apos;d love to hear from you, please fill out this form.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </section>
    </div>
  )
}

export default About
