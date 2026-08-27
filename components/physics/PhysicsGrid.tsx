type PhysicsGridProps = {
  className?: string;
  dense?: boolean;
};

export function PhysicsGrid({ className = "", dense = false }: PhysicsGridProps) {
  const path = dense
    ? "M0 40H720M0 80H720M0 120H720M0 160H720M0 200H720M0 240H720M0 280H720M72 0V320M144 0V320M216 0V320M288 0V320M360 0V320M432 0V320M504 0V320M576 0V320M648 0V320"
    : "M0 64H720M0 128H720M0 192H720M0 256H720M90 0V320M180 0V320M270 0V320M360 0V320M450 0V320M540 0V320M630 0V320";

  return <path className={className} d={path} />;
}

