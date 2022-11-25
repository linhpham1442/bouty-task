import {
 DataGitList
} from './DataGitList';
import React from 'react'

const TutorialGit = () => {
  return (
    <div>
    {DataGitList.map((item, index) => (
      <div key={index} className="title text-24 font-bold mb-8">
       <p className='mb-4'> {item.title}</p>
        <div className="text-16 font-normal space-y-2">
          {item.contents.map((content, index) => {
            return (
              <li key={index}>
              {content}
              </li>
            );
          })}
        </div>
      </div>
    ))}
  </div>
  )
}

export default TutorialGit