import React from 'react'


export default function About() {
  return (
    <div>

    <div className="max-w-full mx-auto px-6 md:px-12 xl:px-6">

    <div className="w-full items-center text-left">
      <h2 className="my-8 text-5xl font-bold text-blue-800 md:text-9xl">
        Dev notes
      </h2>
      <p className="font-bold text-blue-800 pb-5 text-xl">
      Features not yet implemented and soon to come. It's a WIP.
      </p>
      <div className='text-left'>
      <h1 className='font-bold'>Profile</h1>
      <ul>
        <li>
          No password recovery function yet.
        </li>
        <li>
          No password change function yet.
        </li>
        <li>
          No profile delete function yet.
        </li>
      </ul>
      <h1 className='font-bold'>Social Aspects</h1>
      <ul>
        <li>
          No friendship system implemented yet. This trickles down to no group budget system in place although user search works.
        </li>
        <li>
          Need to figure out permissions in regards to deletion and update for grouo budgets.
        </li>
      </ul>
      <h1 className='font-bold'>Dashboard system</h1>
      <ul>
        <li>
          Analytics and stats are in the works.
        </li>
      </ul>
      <h1 className='font-bold'>Budgets/Expenses</h1>
      <ul>
        <li>
          Need to implement better design for expenses.
        </li>
        <li>
          Need to make expense error handling more thorough.
        </li>
      </ul>
      </div>
    </div>

</div>
</div>
  )
}