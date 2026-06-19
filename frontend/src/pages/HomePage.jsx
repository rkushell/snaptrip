import Navbar from "../components/navbar/Navbar";

function HomePage() {
  return (
    <>
      <Navbar />

      <section className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center px-8 text-center">

        <h1 className="mb-6 text-6xl font-bold text-[#1A1423]">
          Capture memories.
          <br />
          Relive journeys.
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-[#69585F]">
          Build collaborative travel albums with friends and preserve memories forever.
        </p>

        <button
          className="
          rounded-3xl
          bg-[#F56476]
          px-8
          py-4
          text-white
          transition
          hover:scale-105"
        >
          Create Trip
        </button>
      </section>
    </>
  );
}

export default HomePage;