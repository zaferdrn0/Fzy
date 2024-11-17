import Link from 'next/link'
import React from 'react'

const Home = () => {

  return (
    <div>
      <h1>Hoş Geldiniz</h1>
      <Link href="/customers">
        <button>Müşteri Listesine Git</button>
      </Link>
    </div>
  );
};

export default Home