export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** Keyed by PhysicsTopic.id from physics-topics.ts. */
export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  "motion-measurement": [
    {
      question: "What is happening when an object's position changes over time?",
      options: ["Measurement", "Motion", "Friction", "Pressure"],
      correctIndex: 1,
      explanation: "A change in position over time is the definition of motion.",
    },
    {
      question: "Reading a ruler from the start point to where the object stopped gives you the:",
      options: ["Speed", "Force", "Measurement of distance", "Mass"],
      correctIndex: 2,
      explanation: "Reading 0 to the stopping mark on a ruler is measuring the distance travelled.",
    },
    {
      question: "Why does a pushed object eventually stop on a real surface?",
      options: ["Gravity pulls it sideways", "Air friction/resistance opposes its motion", "It runs out of mass", "Its color fades"],
      correctIndex: 1,
      explanation: "Friction/air resistance acts opposite to motion and gradually removes the object's speed.",
    },
    {
      question: "Which of these is a standard unit used for measuring distance?",
      options: ["Newton", "Metre", "Watt", "Ampere"],
      correctIndex: 1,
      explanation: "The metre (and its multiples/submultiples) is the standard unit of length/distance.",
    },
  ],
  "light-shadows-reflections": [
    {
      question: "What happens to a shadow's length as you raise the light source higher above an object?",
      options: ["It gets longer", "It gets shorter", "It disappears instantly", "It stays exactly the same"],
      correctIndex: 1,
      explanation: "A higher light makes rays fall more steeply, shrinking the shadow.",
    },
    {
      question: "A shadow forms because the object:",
      options: ["Reflects all light back", "Blocks light from reaching the surface behind it", "Absorbs sound waves", "Emits its own light"],
      correctIndex: 1,
      explanation: "Opaque objects block light, creating a dark region — the shadow — on the far side.",
    },
    {
      question: "If a light source were placed directly overhead, the shadow would be:",
      options: ["Very long", "Nearly absent, right under the object", "Colored", "Impossible to form"],
      correctIndex: 1,
      explanation: "Directly overhead light travels almost straight down, leaving little to no shadow around the base.",
    },
    {
      question: "Which of these best describes reflection of light?",
      options: ["Light passing through a material", "Light bouncing off a surface", "Light bending at a boundary", "Light being absorbed completely"],
      correctIndex: 1,
      explanation: "Reflection is light bouncing back off a surface rather than passing through or being absorbed.",
    },
  ],
  "electricity-circuits": [
    {
      question: "For a bulb to light up, the circuit must be:",
      options: ["Open", "Complete (a closed loop)", "Made only of plastic", "Disconnected from the battery"],
      correctIndex: 1,
      explanation: "Current only flows around an unbroken, closed loop — an open circuit stops the flow.",
    },
    {
      question: "What happens if the wire in a circuit is broken, even with the switch closed?",
      options: ["The bulb lights up brighter", "The bulb stays dark", "Nothing changes", "The battery charges faster"],
      correctIndex: 1,
      explanation: "A broken wire means there's no complete path, so no current can flow regardless of the switch.",
    },
    {
      question: "Adding more battery cells to a simple circuit generally makes the bulb:",
      options: ["Dimmer", "Brighter", "Flicker off", "Change color"],
      correctIndex: 1,
      explanation: "More cells increase the driving voltage, pushing more current through the bulb and brightening it.",
    },
    {
      question: "What is the role of a switch in a circuit?",
      options: ["To store energy", "To open or close the current's path", "To measure voltage", "To create light directly"],
      correctIndex: 1,
      explanation: "A switch is a controlled break in the circuit — closing it completes the path, opening it breaks it.",
    },
  ],
  "fun-with-magnets": [
    {
      question: "What happens when two unlike magnetic poles (N and S) face each other?",
      options: ["They repel", "They attract", "Nothing happens", "They cancel each other's magnetism"],
      correctIndex: 1,
      explanation: "Unlike poles always attract each other.",
    },
    {
      question: "What happens when two like poles (N and N, or S and S) face each other?",
      options: ["They attract", "They repel", "They stick together permanently", "They become non-magnetic"],
      correctIndex: 1,
      explanation: "Like poles always repel — this is the basic rule of magnetism.",
    },
    {
      question: "Every bar magnet has:",
      options: ["Only a north pole", "Only a south pole", "Both a north and a south pole", "No poles at all"],
      correctIndex: 2,
      explanation: "Magnets are dipoles — they always have both a north and a south pole together.",
    },
    {
      question: "Which of these is NOT typically attracted to a magnet?",
      options: ["Iron", "Nickel", "Wood", "Cobalt"],
      correctIndex: 2,
      explanation: "Wood is not a magnetic material; iron, nickel, and cobalt are classic magnetic materials.",
    },
  ],
  "motion-and-time": [
    {
      question: "If two racers travel the same distance, the one who finishes in less time has:",
      options: ["Less speed", "Greater speed", "The same speed always", "No speed"],
      correctIndex: 1,
      explanation: "Speed is distance covered per unit of time — covering the same distance faster means greater speed.",
    },
    {
      question: "Speed is calculated as:",
      options: ["Time ÷ Distance", "Distance ÷ Time", "Distance × Time", "Distance + Time"],
      correctIndex: 1,
      explanation: "Speed = distance travelled divided by the time taken.",
    },
    {
      question: "A device commonly used to measure short time intervals in experiments is a:",
      options: ["Barometer", "Stopwatch", "Thermometer", "Ammeter"],
      correctIndex: 1,
      explanation: "A stopwatch measures elapsed time, which is essential for calculating speed.",
    },
    {
      question: "If both racers move at exactly the same speed, the result of the race is:",
      options: ["The first one always wins", "A dead heat (tie)", "Undefined", "The heavier one wins"],
      correctIndex: 1,
      explanation: "Equal speed over equal distance means they arrive at exactly the same time — a tie.",
    },
  ],
  heat: [
    {
      question: "As you heat a solid, its particles:",
      options: ["Stop moving completely", "Vibrate faster", "Disappear", "Turn into light"],
      correctIndex: 1,
      explanation: "Heating increases particle kinetic energy, making them vibrate faster.",
    },
    {
      question: "When a solid melts into a liquid, its particles:",
      options: ["Lock even more tightly in place", "Gain enough energy to slide past each other", "Stop existing", "Become magnetic"],
      correctIndex: 1,
      explanation: "Melting happens when particles gain enough energy to move past one another instead of staying fixed.",
    },
    {
      question: "In the gas state, particles compared to solid and liquid states:",
      options: ["Move the slowest", "Are the most tightly packed", "Move fastest and spread to fill their container", "Have no energy"],
      correctIndex: 2,
      explanation: "Gas particles have the most energy, move fastest, and spread out to fill available space.",
    },
    {
      question: "Heat is best described as:",
      options: ["A type of particle", "A measure of particle motion/energy", "A color", "A magnetic force"],
      correctIndex: 1,
      explanation: "Heat relates to the kinetic energy of a substance's particles — more heat, more particle motion.",
    },
  ],
  "electric-current-effects": [
    {
      question: "Which of these is NOT one of the three effects of electric current shown in this experiment?",
      options: ["Heating effect", "Magnetic effect", "Lighting effect", "Gravitational effect"],
      correctIndex: 3,
      explanation: "Current produces heating, magnetic, and lighting effects — not a gravitational one.",
    },
    {
      question: "A compass needle near a current-carrying wire deflects because of the current's:",
      options: ["Heating effect", "Magnetic effect", "Chemical effect", "Lighting effect"],
      correctIndex: 1,
      explanation: "Current creates a magnetic field around the wire, which deflects a nearby compass needle.",
    },
    {
      question: "As current through a coil increases, the coil typically:",
      options: ["Cools down", "Heats up more", "Becomes non-magnetic", "Turns transparent"],
      correctIndex: 1,
      explanation: "Higher current increases resistive heating in the coil — this is the heating effect.",
    },
    {
      question: "The fact that one current can heat, magnetize, and light up different devices shows that:",
      options: ["These effects are unrelated coincidences", "A single cause (current) can produce multiple effects", "Only one effect can happen at a time", "Current disappears after producing one effect"],
      correctIndex: 1,
      explanation: "All three effects happen simultaneously because they all stem from the same flowing current.",
    },
  ],
  "light-7": [
    {
      question: "According to the law of reflection, the angle of reflection is:",
      options: ["Always 90°", "Equal to the angle of incidence", "Twice the angle of incidence", "Always 0°"],
      correctIndex: 1,
      explanation: "The law of reflection states the angle of incidence always equals the angle of reflection.",
    },
    {
      question: "The 'normal' in a ray diagram refers to:",
      options: ["The reflected ray", "A line perpendicular to the mirror at the point of incidence", "The mirror's surface itself", "The light source"],
      correctIndex: 1,
      explanation: "The normal is an imaginary line drawn perpendicular (90°) to the surface at the point of contact.",
    },
    {
      question: "If a light ray hits a mirror at 30° from the normal, it reflects at:",
      options: ["15°", "30°", "60°", "90°"],
      correctIndex: 1,
      explanation: "The reflected ray leaves at the same angle from the normal as the incident ray arrived — 30°.",
    },
    {
      question: "A mirror that shows a clear, undistorted image relies mainly on light undergoing:",
      options: ["Regular (predictable) reflection", "Random scattering", "Total absorption", "Refraction only"],
      correctIndex: 0,
      explanation: "A smooth mirror reflects light regularly (in a predictable pattern), producing a clear image.",
    },
  ],
  "force-and-pressure": [
    {
      question: "Pressure is defined as:",
      options: ["Force × Area", "Force ÷ Area", "Area ÷ Force", "Force + Area"],
      correctIndex: 1,
      explanation: "Pressure = Force divided by the Area over which it acts.",
    },
    {
      question: "Why does a pin sink into a surface more easily than a flat block, given the same force?",
      options: ["The pin has less mass", "The pin concentrates force over a much smaller area, producing higher pressure", "The pin is magnetic", "The block has more friction"],
      correctIndex: 1,
      explanation: "The same force over a tiny area creates much greater pressure, so the pin sinks in more easily.",
    },
    {
      question: "Spreading the same force over a larger area results in:",
      options: ["Higher pressure", "Lower pressure", "No change in pressure", "Negative pressure"],
      correctIndex: 1,
      explanation: "Since pressure = force ÷ area, a larger area for the same force gives lower pressure.",
    },
    {
      question: "Which everyday design choice uses the pressure principle to make cutting easier?",
      options: ["A thick, blunt knife edge", "A thin, sharp knife edge", "A wide flat spoon", "A large flat table"],
      correctIndex: 1,
      explanation: "A thin edge concentrates force onto a very small area, creating high pressure that cuts easily.",
    },
  ],
  friction: [
    {
      question: "For the same push, an object slides the shortest distance on which surface?",
      options: ["Ice", "Wood", "Sandpaper", "All the same"],
      correctIndex: 2,
      explanation: "Sandpaper is the roughest surface, creating the most friction and stopping the object soonest.",
    },
    {
      question: "Friction is a force that acts:",
      options: ["In the same direction as motion", "Opposite to the direction of motion", "Perpendicular to motion only", "Only when objects are magnetic"],
      correctIndex: 1,
      explanation: "Friction always opposes relative motion between two surfaces in contact.",
    },
    {
      question: "Which surface would let an object slide the farthest for the same push?",
      options: ["Sandpaper", "Wood", "Ice", "Carpet"],
      correctIndex: 2,
      explanation: "Ice is smooth and has low friction, letting the object travel farther before stopping.",
    },
    {
      question: "Does the amount of pushing force change how much friction resists an object on a given surface?",
      options: ["Yes, friction is unrelated to the surface entirely", "The surface's roughness — not just the push — determines how much friction resists motion", "Friction only exists on ice", "Friction always equals zero"],
      correctIndex: 1,
      explanation: "Friction depends on the surfaces in contact (roughness) — comparing surfaces at the same push isolates that effect.",
    },
  ],
  sound: [
    {
      question: "What determines the pitch of a sound?",
      options: ["Amplitude", "Frequency", "Volume only", "Color of the source"],
      correctIndex: 1,
      explanation: "Frequency (vibrations per second) determines pitch — higher frequency means higher pitch.",
    },
    {
      question: "What determines how loud a sound is?",
      options: ["Frequency", "Amplitude", "Wavelength only", "Distance from the moon"],
      correctIndex: 1,
      explanation: "Amplitude (the size of the vibration) determines loudness.",
    },
    {
      question: "Increasing frequency while keeping amplitude the same will make the sound:",
      options: ["Louder but same pitch", "Higher-pitched but same loudness", "Both louder and higher-pitched", "Silent"],
      correctIndex: 1,
      explanation: "Frequency controls pitch independently of amplitude, which controls loudness.",
    },
    {
      question: "Sound is produced by:",
      options: ["Static electric charge", "Vibrating objects/membranes", "Magnetic fields", "Light waves"],
      correctIndex: 1,
      explanation: "Sound originates from vibrations that travel as waves through a medium like air.",
    },
  ],
  "natural-phenomena": [
    {
      question: "Lightning is caused by:",
      options: ["Sound waves in the atmosphere", "Static charge building up until it suddenly discharges", "Wind alone", "Magnetic poles reversing"],
      correctIndex: 1,
      explanation: "Charge builds up on clouds until it's large enough to discharge suddenly as a lightning bolt.",
    },
    {
      question: "Seismic waves from an earthquake travel outward from the:",
      options: ["Seismograph station", "Epicenter", "Ocean only", "Moon"],
      correctIndex: 1,
      explanation: "Earthquake waves ripple outward from the epicenter, the point where the quake originates.",
    },
    {
      question: "A seismograph is used to:",
      options: ["Generate lightning", "Detect and record ground shaking from seismic waves", "Measure temperature", "Produce static charge"],
      correctIndex: 1,
      explanation: "Seismographs detect and record the arrival and strength of seismic waves.",
    },
    {
      question: "What do lightning and earthquakes have in common as natural phenomena?",
      options: ["Both involve sudden release of built-up energy", "Both are caused by ocean currents", "Both require magnets", "Neither can be studied scientifically"],
      correctIndex: 0,
      explanation: "Both involve energy (electrical charge or geological stress) building up and then releasing suddenly.",
    },
  ],
  "light-8": [
    {
      question: "A concave mirror curves:",
      options: ["Outward, like the back of a spoon", "Inward, like the inside of a bowl", "Not at all — it's flat", "Only at the edges"],
      correctIndex: 1,
      explanation: "A concave mirror's reflecting surface curves inward, like the inside of a spoon.",
    },
    {
      question: "A convex mirror always produces an image that is:",
      options: ["Real and inverted", "Virtual, upright, and diminished", "Larger than the object always", "Impossible to form"],
      correctIndex: 1,
      explanation: "Convex mirrors always form virtual, upright, and smaller (diminished) images, regardless of object distance.",
    },
    {
      question: "A concave mirror can form a real image when the object is:",
      options: ["Placed beyond the focal point", "Always, no matter where it's placed", "Never", "Only if it's a convex mirror"],
      correctIndex: 0,
      explanation: "Concave mirrors form real, inverted images when the object is beyond the focal point.",
    },
    {
      question: "Which type of mirror is commonly used as a vehicle side mirror for a wider field of view?",
      options: ["Concave", "Flat/plane", "Convex", "None — mirrors aren't used"],
      correctIndex: 2,
      explanation: "Convex mirrors show a wider area (though smaller images), which is why they're used as side mirrors.",
    },
  ],
  "chemical-effects-electric-current": [
    {
      question: "The process of using electric current to drive a chemical reaction in a solution is called:",
      options: ["Reflection", "Electrolysis", "Refraction", "Convection"],
      correctIndex: 1,
      explanation: "Electrolysis is the term for using electric current to cause a chemical reaction in a solution.",
    },
    {
      question: "In the electrolysis experiment, what forms at the electrodes as voltage increases?",
      options: ["Ice", "Gas bubbles, faster at higher voltage", "Sound waves", "Magnetic fields"],
      correctIndex: 1,
      explanation: "Higher voltage drives the reaction faster, producing gas bubbles more quickly at each electrode.",
    },
    {
      question: "Below a certain very low voltage in electrolysis, what tends to happen?",
      options: ["The reaction speeds up dramatically", "There may not be enough current to drive the reaction at all", "The liquid freezes instantly", "The electrodes become magnetic"],
      correctIndex: 1,
      explanation: "At very low voltage, there's often insufficient current to sustain the chemical reaction.",
    },
    {
      question: "Electrolysis demonstrates that electric current can:",
      options: ["Only produce heat", "Only produce light", "Trigger chemical changes", "Only affect magnets"],
      correctIndex: 2,
      explanation: "This experiment shows current's chemical effect — it can drive reactions that wouldn't otherwise happen.",
    },
  ],
  motion: [
    {
      question: "On a distance-time graph, a straight line indicates:",
      options: ["Constant speed", "Constantly changing speed", "The object is stationary always", "An error in the graph"],
      correctIndex: 0,
      explanation: "A straight (constant-slope) line on a distance-time graph means the speed isn't changing.",
    },
    {
      question: "On a speed-time graph, a flat horizontal line means the object is:",
      options: ["Accelerating rapidly", "Moving at constant speed", "Stationary", "Slowing to a stop"],
      correctIndex: 1,
      explanation: "A flat line on a speed-time graph means speed isn't changing — constant speed.",
    },
    {
      question: "A curving (non-straight) distance-time graph shows that the object's speed is:",
      options: ["Constant", "Changing over time", "Zero", "Undefined"],
      correctIndex: 1,
      explanation: "A bending curve on a distance-time graph reflects a speed that is increasing or decreasing.",
    },
    {
      question: "The slope (steepness) of a distance-time graph represents the object's:",
      options: ["Mass", "Speed", "Temperature", "Color"],
      correctIndex: 1,
      explanation: "The steeper the slope of a distance-time graph, the greater the speed at that moment.",
    },
  ],
  "force-and-laws-of-motion": [
    {
      question: "Newton's second law states that acceleration equals:",
      options: ["Force × Mass", "Force ÷ Mass", "Mass ÷ Force", "Force + Mass"],
      correctIndex: 1,
      explanation: "Newton's second law: acceleration = force ÷ mass (a = F/m).",
    },
    {
      question: "For the same applied force, a heavier object will accelerate:",
      options: ["Faster than a lighter one", "Slower than a lighter one", "Exactly the same as a lighter one", "Not at all"],
      correctIndex: 1,
      explanation: "Since a = F/m, a larger mass results in smaller acceleration for the same force.",
    },
    {
      question: "Mass and weight are:",
      options: ["Exactly the same thing", "Different — mass is the amount of matter, weight is the force of gravity on it", "Both measured in Newtons", "Unrelated to each other"],
      correctIndex: 1,
      explanation: "Mass (kg) measures matter content; weight is the gravitational force on that mass (measured in Newtons).",
    },
    {
      question: "If you double the force on an object while keeping its mass the same, its acceleration:",
      options: ["Stays the same", "Doubles", "Is cut in half", "Becomes zero"],
      correctIndex: 1,
      explanation: "Since a = F/m, doubling force while mass is constant doubles the acceleration.",
    },
  ],
  gravitation: [
    {
      question: "With no air resistance, do a heavy ball and a light feather fall at the same rate?",
      options: ["No, the heavier one always falls faster", "Yes, gravity accelerates all masses equally", "No, the lighter one falls faster", "They both stay still"],
      correctIndex: 1,
      explanation: "Without air resistance, gravity gives every object the same acceleration regardless of mass (Galileo's result).",
    },
    {
      question: "Why does a feather normally fall slower than a ball in real life (with air present)?",
      options: ["The feather has more mass", "Air resistance affects the feather's large surface area much more", "Gravity is weaker on feathers", "Feathers are magnetic"],
      correctIndex: 1,
      explanation: "Air resistance pushes back more on the feather's large, light shape, slowing its fall.",
    },
    {
      question: "The symbol 'g' commonly represents:",
      options: ["Mass of an object", "Acceleration due to gravity", "Electric charge", "Frequency of sound"],
      correctIndex: 1,
      explanation: "'g' is the standard symbol for the acceleration due to gravity near Earth's surface.",
    },
    {
      question: "In a vacuum (no air at all), a coin and a feather dropped together would:",
      options: ["Land at completely different times", "Land at the same time", "Never fall", "Float upward"],
      correctIndex: 1,
      explanation: "With no air resistance to interfere, both objects accelerate identically and land together.",
    },
  ],
  "work-and-energy": [
    {
      question: "At the highest point of a swing, a pendulum has:",
      options: ["Maximum kinetic energy, zero potential energy", "Maximum potential energy, minimum kinetic energy", "Zero energy of any kind", "Equal amounts of both, always"],
      correctIndex: 1,
      explanation: "At the peak, the pendulum is momentarily still (near-zero KE) and highest up (max PE).",
    },
    {
      question: "At the lowest point of its swing, a pendulum has:",
      options: ["Maximum potential energy", "Maximum kinetic energy", "No energy at all", "Only heat energy"],
      correctIndex: 1,
      explanation: "At the bottom, height (and thus PE) is lowest while speed (and KE) is highest.",
    },
    {
      question: "With no friction, a pendulum's total mechanical energy over time stays:",
      options: ["Constantly increasing", "Constantly decreasing", "Constant (conserved)", "Always zero"],
      correctIndex: 2,
      explanation: "Without friction, energy just converts between potential and kinetic — the total stays constant.",
    },
    {
      question: "When friction is present, the energy 'lost' from the swinging motion actually:",
      options: ["Disappears completely, violating physics", "Converts into heat and sound", "Turns into extra potential energy", "Is stored as electric charge"],
      correctIndex: 1,
      explanation: "Energy is never destroyed — friction converts some mechanical energy into heat and sound.",
    },
  ],
  "sound-9": [
    {
      question: "When two identical sound waves arrive perfectly in phase (0° difference), the result is:",
      options: ["Silence", "A louder sound (constructive interference)", "A higher pitch only", "No change at all"],
      correctIndex: 1,
      explanation: "In-phase waves add their amplitudes together, producing a louder combined sound.",
    },
    {
      question: "When two identical sound waves are exactly out of phase (180° difference), the result is:",
      options: ["A much louder sound", "Near-cancellation (destructive interference)", "A change in color", "No effect on sound"],
      correctIndex: 1,
      explanation: "Out-of-phase waves have crests meeting troughs, largely canceling each other out.",
    },
    {
      question: "The phenomenon where two waves combine to affect loudness is called:",
      options: ["Refraction", "Interference", "Reflection", "Diffusion"],
      correctIndex: 1,
      explanation: "Interference describes how overlapping waves combine, either boosting or canceling each other.",
    },
    {
      question: "A phase difference partway between 0° and 180° typically results in:",
      options: ["Total silence always", "Maximum loudness always", "A partial boost or partial cancellation", "No sound can exist"],
      correctIndex: 2,
      explanation: "Between fully in-phase and fully out-of-phase, the combined effect is a partial change in loudness.",
    },
  ],
  "light-reflection-refraction": [
    {
      question: "When light enters a denser medium (like water or glass) from air, it bends:",
      options: ["Away from the normal", "Toward the normal", "It doesn't bend at all", "Backward, away from the surface"],
      correctIndex: 1,
      explanation: "Light bends toward the normal when entering a denser (higher refractive index) medium.",
    },
    {
      question: "Refraction happens because light:",
      options: ["Changes color when crossing a boundary", "Changes speed when crossing between different media", "Stops moving entirely", "Turns into sound"],
      correctIndex: 1,
      explanation: "A change in speed as light crosses a boundary between media is what causes it to bend.",
    },
    {
      question: "Glass has a higher refractive index than water. Compared to water, light entering glass will bend:",
      options: ["Less toward the normal", "More toward the normal", "Exactly the same amount", "Away from the normal instead"],
      correctIndex: 1,
      explanation: "A higher refractive index means a greater change in speed, causing more bending toward the normal.",
    },
    {
      question: "Why does a straw appear bent when placed in a glass of water?",
      options: ["The straw physically bends", "Light refracts at the air-water boundary, shifting the apparent position", "Water absorbs part of the straw", "It's an optical illusion unrelated to light"],
      correctIndex: 1,
      explanation: "Refraction at the water's surface bends the light path, making the submerged part appear shifted.",
    },
  ],
  "human-eye-colourful-world": [
    {
      question: "Myopia (near-sightedness) happens when the eye focuses light:",
      options: ["Exactly on the retina", "In front of the retina", "Behind the retina", "Outside the eye entirely"],
      correctIndex: 1,
      explanation: "In myopia, the image forms in front of the retina instead of directly on it.",
    },
    {
      question: "Hyperopia (far-sightedness) is corrected using a lens that is:",
      options: ["Diverging (concave)", "Converging (convex)", "Flat with no curve", "Colored"],
      correctIndex: 1,
      explanation: "A converging (convex) lens brings the focus point forward onto the retina, correcting hyperopia.",
    },
    {
      question: "A prism splits white light into a spectrum of colors because:",
      options: ["Each color travels at a different speed and bends by a different amount inside the prism", "The prism dyes the light", "White light is a single color that changes randomly", "Prisms only work with sunlight"],
      correctIndex: 0,
      explanation: "Different colors (wavelengths) refract by slightly different amounts, spreading them into a spectrum.",
    },
    {
      question: "Myopia is corrected using a lens that is:",
      options: ["Converging (convex)", "Diverging (concave)", "A prism", "A mirror"],
      correctIndex: 1,
      explanation: "A diverging (concave) lens pushes the focus point back onto the retina, correcting myopia.",
    },
  ],
  electricity: [
    {
      question: "Ohm's Law states that current equals:",
      options: ["Voltage × Resistance", "Voltage ÷ Resistance", "Resistance ÷ Voltage", "Voltage + Resistance"],
      correctIndex: 1,
      explanation: "Ohm's Law: Current (I) = Voltage (V) ÷ Resistance (R).",
    },
    {
      question: "If resistance in a circuit increases while voltage stays the same, the current will:",
      options: ["Increase", "Decrease", "Stay exactly the same", "Become negative"],
      correctIndex: 1,
      explanation: "Since I = V/R, a higher resistance for the same voltage results in lower current.",
    },
    {
      question: "If voltage increases while resistance stays the same, the current will:",
      options: ["Decrease", "Increase", "Stay the same", "Disappear"],
      correctIndex: 1,
      explanation: "Since I = V/R, increasing voltage for a fixed resistance increases the current.",
    },
    {
      question: "Resistance is measured in units called:",
      options: ["Volts", "Amperes", "Ohms", "Watts"],
      correctIndex: 2,
      explanation: "Resistance is measured in Ohms (Ω).",
    },
  ],
  "magnetic-effects-electric-current": [
    {
      question: "A wire carrying electric current produces:",
      options: ["No effect on nearby objects", "A magnetic field around itself", "Sound waves only", "Light only"],
      correctIndex: 1,
      explanation: "Any current-carrying wire generates a magnetic field around it — this is the magnetic effect of current.",
    },
    {
      question: "If you reverse the direction of current in a wire, the magnetic field around it:",
      options: ["Stays exactly the same", "Also reverses direction", "Disappears completely", "Doubles in strength automatically"],
      correctIndex: 1,
      explanation: "Reversing current direction reverses the magnetic field's direction, flipping the compass deflection.",
    },
    {
      question: "A compass placed near a current-carrying wire will:",
      options: ["Remain completely unaffected", "Deflect due to the wire's magnetic field", "Stop working permanently", "Start glowing"],
      correctIndex: 1,
      explanation: "The magnetic field from the current pushes the compass needle to deflect from its normal position.",
    },
    {
      question: "This magnetic effect of current is the basic principle behind:",
      options: ["Thermometers", "Electromagnets", "Prisms", "Mirrors"],
      correctIndex: 1,
      explanation: "Electromagnets work by using current through a coil to produce a controllable magnetic field.",
    },
  ],
  "sources-of-energy": [
    {
      question: "Which of these is a renewable energy source?",
      options: ["Coal", "Solar", "Petroleum", "Natural gas"],
      correctIndex: 1,
      explanation: "Solar energy is continuously replenished by the sun and is considered renewable.",
    },
    {
      question: "Fossil fuels like coal and petroleum are considered non-renewable because:",
      options: ["They are replenished instantly", "They took millions of years to form and are used far faster than they're replaced", "They don't produce energy", "They are magnetic"],
      correctIndex: 1,
      explanation: "Fossil fuels form over geological timescales, far slower than the rate we consume them.",
    },
    {
      question: "Which of these energy sources is renewable?",
      options: ["Nuclear (uranium)", "Wind", "Natural gas", "Coal"],
      correctIndex: 1,
      explanation: "Wind is continuously generated by the sun's uneven heating of the atmosphere — a renewable source.",
    },
    {
      question: "Why is uranium (used in nuclear power) considered non-renewable, even though it isn't a fossil fuel?",
      options: ["It's radioactive", "It's a mined mineral resource with a finite underground supply", "It doesn't produce energy", "It's actually renewable"],
      correctIndex: 1,
      explanation: "Uranium is mined from a limited supply in the Earth, so it's classified as non-renewable despite not being a fossil fuel.",
    },
  ],
};
