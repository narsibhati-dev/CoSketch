import { Cloud, Pencil, Share2, Stars, Users, Zap } from 'lucide-react';
import { ReactElement } from 'react';
import { fraunces } from '@/data/fonts';

const featureItems = [
  {
    id: 1,
    title: 'Real-time Collaboration',
    description:
      'See every stroke as it happens. Work alongside teammates with zero lag and instant updates across all devices.',
    icon: <Share2 className='h-5 w-5' />,
    number: '01',
  },
  {
    id: 2,
    title: 'Team Workspaces',
    description:
      'Organise your boards by project or team. Keep everything structured, shared, and always accessible.',
    icon: <Users className='h-5 w-5' />,
    number: '02',
  },
  {
    id: 3,
    title: 'Cloud Storage',
    description:
      'Your boards are automatically saved and synced. Pick up exactly where you left off on any device.',
    icon: <Cloud className='h-5 w-5' />,
    number: '03',
  },
  {
    id: 4,
    title: 'Smart Drawing Tools',
    description:
      'An intuitive toolkit built to stay out of your way — so your ideas can take shape without friction.',
    icon: <Stars className='h-5 w-5' />,
    number: '04',
  },
  {
    id: 5,
    title: 'Lightning Fast',
    description:
      'Engineered for performance. Smooth, responsive drawing even on large shared canvases with your whole team.',
    icon: <Zap className='h-5 w-5' />,
    number: '05',
  },
  {
    id: 6,
    title: 'Custom Styles',
    description:
      'Express yourself with custom colors, stroke weights, and style presets that match your creative voice.',
    icon: <Pencil className='h-5 w-5' />,
    number: '06',
  },
];

export function Features() {
  return (
    <section id='features' className='w-full scroll-mt-20 bg-[#f9f6ef] py-24'>
      <div className='mx-auto max-w-7xl px-6'>

        {/* Section header */}
        <div className='mb-16 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div>
            <span className='mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-[#e04e1f]'>
              Features
            </span>
            <h2
              className={`${fraunces.className} max-w-md text-4xl font-semibold leading-tight text-[#1a1916] md:text-5xl`}
            >
              Everything your
              <br />
              <em>team needs</em>
            </h2>
          </div>
          <p className='max-w-xs text-sm leading-relaxed text-[#7a7770] md:text-right'>
            From quick sketches to detailed diagrams — CoSketch gives your team the tools to think visually and move fast.
          </p>
        </div>

        {/* Feature grid */}
        <div className='grid grid-cols-1 gap-px bg-[#e8e2d4] sm:grid-cols-2 lg:grid-cols-3'>
          {featureItems.map(item => (
            <Card
              key={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
              number={item.number}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CardProps {
  title: string;
  description: string;
  icon: ReactElement;
  number: string;
}

function Card({ title, description, icon, number }: CardProps) {
  return (
    <div className='group flex flex-col gap-4 bg-[#f9f6ef] p-8 transition-colors duration-200 hover:bg-[#f5f1e8]'>
      <div className='flex items-start justify-between'>
        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1916]/[0.06] text-[#1a1916]/60 transition-colors group-hover:bg-[#e04e1f]/10 group-hover:text-[#e04e1f]'>
          {icon}
        </div>
        <span className='text-xs font-medium tabular-nums text-[#b8b4ab]'>
          {number}
        </span>
      </div>
      <div>
        <h3 className='mb-1.5 text-base font-semibold text-[#1a1916]'>{title}</h3>
        <p className='text-sm leading-relaxed text-[#7a7770]'>{description}</p>
      </div>
    </div>
  );
}

export default Features;
