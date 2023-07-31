import Image from "next/image";
import { useThemeState } from "../Themes/useThemeState";

const useMuscleGroupIcons = (size = 100) => {
  const { theme } = useThemeState();
  const themeMode = theme.type;

  const icons = {
    "upper back": (
      <div
        style={
          themeMode === "dark"
            ? { filter: "invert(90%) hue-rotate(190deg)" }
            : { filter: "brightness(.9)" }
        }
      >
        <Image
          src="/muscle-group-icons/upper-back.jpg"
          height={size}
          width={size}
          alt="Upper back muscles"
        />
      </div>
    ),
    "lower back": (
      <div
        style={
          themeMode === "dark"
            ? { filter: "invert(90%) hue-rotate(190deg)" }
            : { filter: "brightness(.9)" }
        }
      >
        <Image
          src="/muscle-group-icons/lower-back.jpg"
          height={size}
          width={size}
          alt="Lower back muscles"
        />
      </div>
    ),
    shoulder: (
      <div
        style={
          themeMode === "dark"
            ? { filter: "invert(90%) hue-rotate(190deg)" }
            : { filter: "brightness(.9)" }
        }
      >
        <Image
          src="/muscle-group-icons/shoulder.jpg"
          height={size}
          width={size}
          alt="Shoulder muscles"
        />
      </div>
    ),
    "upper arm": (
      <div
        style={
          themeMode === "dark"
            ? { filter: "invert(90%) hue-rotate(190deg)" }
            : { filter: "brightness(.9)" }
        }
      >
        <Image
          src="/muscle-group-icons/biceps.jpg"
          height={size}
          width={size}
          alt="Upper arm muscles"
        />
      </div>
    ),
    chest: (
      <div
        style={
          themeMode === "dark"
            ? { filter: "invert(90%) hue-rotate(190deg)" }
            : { filter: "brightness(.9)" }
        }
      >
        <Image src="/muscle-group-icons/chest.jpg" height={size} width={size} alt="Chest muscles" />
      </div>
    ),
    "upper leg": (
      <div
        style={
          themeMode === "dark"
            ? { filter: "invert(90%) hue-rotate(190deg)" }
            : { filter: "brightness(.9)" }
        }
      >
        <Image
          src="/muscle-group-icons/quads.jpg"
          height={size}
          width={size}
          alt="Upper leg muscles"
        />
      </div>
    ),
    "lower leg": (
      <div
        style={
          themeMode === "dark"
            ? { filter: "invert(90%) hue-rotate(190deg)" }
            : { filter: "brightness(.9)" }
        }
      >
        <Image
          src="/muscle-group-icons/calves.jpg"
          height={size}
          width={size}
          alt="Lower leg muscles"
        />
      </div>
    ),
    core: (
      <div
        style={
          themeMode === "dark"
            ? { filter: "invert(90%) hue-rotate(190deg)" }
            : { filter: "brightness(.9)" }
        }
      >
        <Image
          src="/muscle-group-icons/abs.jpg"
          height={size}
          width={size}
          alt="Abdominal muscles"
        />
      </div>
    ),
    hamstrings: (
      <Image
        src="/muscle-group-icons/hamstrings.jpg"
        height={size}
        width={size}
        alt="Hamstring muscles"
      />
    ),
    hip: (
      <div
        style={
          themeMode === "dark"
            ? { filter: "invert(90%) hue-rotate(190deg)" }
            : { filter: "brightness(.9)" }
        }
      >
        <Image
          src="/muscle-group-icons/hamstrings.jpg"
          height={size}
          width={size}
          alt="Hip muscles"
        />
      </div>
    ),
    cardio: (
      <div
        style={
          themeMode === "dark"
            ? { filter: "invert(90%) hue-rotate(175deg) contrast(99%)" }
            : { filter: "brightness(.9)" }
        }
      >
        <Image
          src="/muscle-group-icons/cardio.webp"
          height={size}
          width={size}
          alt="Heart muscle"
        />
      </div>
    ),
    forearm: (
      <div
        style={
          themeMode === "dark"
            ? {
                filter:
                  "invert(90%) hue-rotate(175deg) grayscale(15%) contrast(95%) brightness(0.85)",
              }
            : {}
        }
      >
        <Image
          src="/muscle-group-icons/forearm.webp"
          height={size}
          width={size}
          alt="Forearm muscles"
        />
      </div>
    ),
  }; // TODO need icons for: hip

  return icons;
};

export default useMuscleGroupIcons;
