import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ListPage from '../../components/ListPage'
import { BASE_URL } from '../../constants/settiings'

import { TopicListStoreProvider } from '../../stores/topic'
import { User } from '../../types/user'

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'topics'
  const [activeKey, setActiveKey] = useState(tab)

  const tabs = [
    { key: 'topics', label: 'Topics', visibility: 1 },
    { key: 'favorites', label: 'Favorites', visibility: 1 },
  ]

  const handleTabSelect = (key: string) => {
    if (key === 'topics') {
      setActiveKey(key)
      searchParams.delete('page')
      searchParams.delete('tab')
      setSearchParams({...searchParams})
    } else {
      setActiveKey(key)
      searchParams.delete('page')
      setSearchParams({
        ...searchParams,
        tab: key
      })
    }
  }

  const generateHeadline = (user: User) => {
    return <h2>
      <img
        alt={user?.username}
        src={`${BASE_URL}${user?.avatar}`}
        title={user?.nickname || user?.username}
        width={100}
      />
    </h2>
  }

  const generateSecondary = (user: User) => {
    return <>
      <h4 className="mt-3">{user?.nickname || user?.username}</h4>
      <p className="text-secondary">{user?.bio}</p>
    </>
  }

  return (
    <TopicListStoreProvider activeKey={activeKey}>
      <ListPage
        activeKey={activeKey}
        defaultActiveKey="topics"
        generateHeadline={generateHeadline}
        generateSecondary={generateSecondary}
        handleTabSelect={handleTabSelect}
        tabs={tabs}
      />
    </TopicListStoreProvider>
  )
}

export default Profile
