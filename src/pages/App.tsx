import PublicLayout from "@/components/PublicLayout";

export default function App() {
  return (
    <PublicLayout>
      <section className="flex flex-col justify-center items-center w-full">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center">The World Without Art {" "}
          <span className="gradient-text">Its Just A Rock,</span>
        </h1>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center">
          <span className="gradient-text">building a website</span> is the same
        </h1>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center">
          as making <span className="gradient-text">a painting</span>
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-4xl mt-6">
          Welcome to my portfolio. This website is designed to showcase my expertise in web development and software engineering. Here, you'll find information about my skills, experience, and projects that demonstrate my passion for creating beautiful, functional, and user-centric digital solutions.
        </p>

      </section>

      <section className="text-lg md:text-xl text-muted-foreground flex w-full justify-center items-center mt-10">
        <p className="w-full">
          Hello my name is Dafa Ghaitsa, I am a software engineer with a passion for creating beautiful and functional websites. I have experience in both frontend and backend development, and I am always looking for new challenges to improve my skills. This website is a showcase of my work and a place where I share my thoughts on web development and design.
        </p>
        <div className="w-full flex justify-center items-center">
          <img src="" alt="Your Name" className="w-32 h-32 object-cover" />
        </div>
      </section>
    </PublicLayout>
  );
}