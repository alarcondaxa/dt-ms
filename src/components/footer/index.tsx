import Image from 'next/image';

export default function Footer() {
  return (
    <footer className='w-full flex items-center justify-between mx-auto max-w-[1050px] border-t border-t-[#1a1a1a] border-solid my-4 pt-4 px-2'>
      <div className='flex items-center gap-4'>
        <Image src='/assets/svgs/gov.svg' alt='img' width={80} height={40} />
        <p className='text-xs text-545d69'>
          © {new Date().getFullYear()} Departamento Estadual de Trânsito - Todos
          os direitos reservados
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <svg
          stroke='#545d69'
          fill='#545d69'
          strokeWidth={0}
          viewBox='0 0 512 512'
          className='hidden md:block rotate-90 size-6'
          height='1em'
          width='1em'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z'
            stroke='none'
          />
        </svg>
        <p className='text-sm text-545d69'>
          Fale com a Glória <span className='font-bold'>(67) 3368-0500</span>
        </p>
      </div>
    </footer>
  );
}
