import dafaImage from "@/assets/images/dafa.jpeg";

export default function AboutSection() {
  return (
    <section className="text-muted-foreground flex flex-col md:flex-row w-full max-w-6xl mx-auto px-6 justify-between items-center gap-8">
      <div className="flex-col w-full">
        <h1 className="w-full justify-start items-center text-4xl text-primary">About Me</h1>
        <hr className="my-4 w-1/2" />
        <p className="w-full text-lg md:text-2xl">
          Hello my name is Dafa Ghaitsa, I am a website developer with a passion for creating beautiful and functional websites. I have experience in both frontend and backend development, and I am always looking for new challenges to improve my skills. This website is a showcase of my work and a place where I share my thoughts on web development and design.
        </p>
      </div>
      <div className="w-full flex justify-center items-center">
        <img
          src={dafaImage}
          alt="Dafa Ghaitsa"
          className="h-64 md:h-98 rounded-sm grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
        />
      </div>
    </section>
  );
}
