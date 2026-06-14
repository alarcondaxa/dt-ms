export default async function getUf() {
  try {
    // 3366dff7a4ac25
    const res = await fetch('https://ipinfo.io/json?token=d615540449f866', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('error');
    const data = await res.json();
    return {
      uf: data.region.toLowerCase(),
      city: data.city.toLowerCase(),
    };
  } catch {
    // console.log(err);
    return null;
  }
}
