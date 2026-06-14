import Image from 'next/image';

import { IoMenu } from 'react-icons/io5';

export default function Header() {
  return (
    <header className='w-full flex flex-col'>
      <div className='w-full bg-white h-10 px-6 max-[600px]:bg-003f7e max-[600px]:flex max-[600px]:justify-center max-[600px]:items-center'>
        <div className='w-full max-w-[1050px] max-[600px]:hidden mx-auto h-full flex items-center justify-between'>
          <div className='gap-8 flex items-center'>
            <h2 className='font-bold text-base text-1351b4'>FALE CONOSCO</h2>
            <h2 className='font-bold text-base text-1351b4'>SITE DETRAN MS</h2>
          </div>
          <div className='gap-8 flex items-center'>
            <h2 className='font-bold text-base text-1351b4'>OUVIDORIA</h2>
            <h2 className='font-bold text-base text-1351b4'>TRANSPARÊNCIA</h2>
          </div>
        </div>
        <IoMenu
          className='max-[600px]:inline-block hidden text-white'
          size={33}
          fill='#fff'
        />
      </div>
      <div className='w-full px-6 bg-004f9f h-[128px]'>
        <div className='w-full max-w-[1050px] mx-auto h-full flex justify-between'>
          <a href='/'>
            <Image
              src='/assets/svgs/logo.svg'
              width={90}
              height={118}
              alt='img'
            />
          </a>
          <Image
            src='/assets/svgs/my-dt.svg'
            width={340}
            height={80}
            alt='img'
            className='max-[600px]:w-[205px]! max-[600px]:h-[48px]! max-[600px]:self-center'
          />
          <div className='flex items-center gap-3 max-[800px]:hidden'>
            <svg
              stroke='#fff'
              fill='#fff'
              strokeWidth={0}
              viewBox='0 0 24 24'
              className='inline size-5 md:size-6 lg:size-8 hover:text-gray-200 transition'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z'
                stroke='none'
              />
            </svg>
            <svg
              stroke='#fff'
              fill='#fff'
              strokeWidth={0}
              viewBox='0 0 24 24'
              className='inline size-5 md:size-6 lg:size-8 hover:text-gray-200 transition'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.014L2.32 21h2.65l5.518-6.349zM16.25 19L5.75 5h2l10.5 14h-2z'
                stroke='none'
              />
            </svg>
            <svg
              stroke='#fff'
              fill='#fff'
              strokeWidth={0}
              viewBox='0 0 24 24'
              className='inline size-5 md:size-6 lg:size-8 hover:text-gray-200 transition'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12.001 9a3 3 0 100 6 3 3 0 000-6zm0-2a5 5 0 110 10 5 5 0 010-10zm6.5-.25a1.25 1.25 0 01-2.5 0 1.25 1.25 0 012.5 0zM12.001 4c-2.474 0-2.878.007-4.029.058-.784.037-1.31.142-1.798.332-.434.168-.747.369-1.08.703a2.89 2.89 0 00-.704 1.08c-.19.49-.295 1.015-.331 1.798C4.007 9.075 4 9.461 4 12c0 2.475.007 2.878.058 4.029.037.783.142 1.31.331 1.797.17.435.37.748.702 1.08.337.336.65.537 1.08.703.494.191 1.02.297 1.8.333 1.104.052 1.49.058 4.029.058 2.475 0 2.878-.007 4.029-.058.782-.037 1.308-.142 1.797-.331.433-.169.748-.37 1.08-.703.337-.336.538-.649.704-1.08.19-.492.296-1.018.332-1.8.052-1.103.058-1.49.058-4.028 0-2.474-.007-2.878-.058-4.029-.037-.782-.143-1.31-.332-1.798a2.912 2.912 0 00-.703-1.08 2.884 2.884 0 00-1.08-.704c-.49-.19-1.016-.295-1.798-.331C14.926 4.006 14.54 4 12 4zm0-2c2.717 0 3.056.01 4.123.06 1.064.05 1.79.217 2.427.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.884 4.884 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.427.465-1.067.047-1.406.06-4.123.06-2.717 0-3.056-.01-4.123-.06-1.064-.05-1.789-.218-2.427-.465a4.89 4.89 0 01-1.772-1.153 4.905 4.905 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428-.048-1.066-.06-1.405-.06-4.122 0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772 4.897 4.897 0 011.772-1.153c.637-.248 1.362-.415 2.427-.465C8.945 2.013 9.284 2 12.001 2z'
                stroke='none'
              />
            </svg>
            <svg
              stroke='#fff'
              fill='#fff'
              strokeWidth={0}
              viewBox='0 0 24 24'
              className='inline size-5 md:size-6 lg:size-8 hover:text-gray-200 transition'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M16 8.245V15.5a6.5 6.5 0 11-5-6.326v3.163a3.5 3.5 0 102 3.163V2h3a5 5 0 005 5v3a7.966 7.966 0 01-5-1.755z'
                stroke='none'
              />
            </svg>
            <svg
              stroke='#fff'
              fill='#fff'
              strokeWidth={0}
              viewBox='0 0 24 24'
              className='inline size-5 md:size-6 lg:size-8 hover:text-gray-200 transition'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12.244 4c.534.003 1.87.016 3.29.073l.504.022c1.429.067 2.857.183 3.566.38.945.266 1.687 1.04 1.938 2.022.4 1.56.45 4.602.456 5.339l.001.152v.174c-.007.737-.057 3.78-.457 5.339-.254.985-.997 1.76-1.938 2.022-.709.197-2.137.313-3.566.38l-.504.023c-1.42.056-2.756.07-3.29.072l-.235.001H12h-.245c-1.13-.007-5.856-.058-7.36-.476-.944-.266-1.687-1.04-1.938-2.022-.4-1.56-.45-4.602-.456-5.339v-.326c.006-.737.056-3.78.456-5.339.254-.985.997-1.76 1.939-2.021 1.503-.419 6.23-.47 7.36-.476h.489zM9.999 8.5v7l6-3.5-6-3.5z'
                stroke='none'
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
