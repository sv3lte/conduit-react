import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Form } from 'react-bootstrap'
import { AxiosResponse } from 'axios'
import Vditor from 'vditor'
import Header from '../../components/Header'
import TopicBanner from './TopicBanner'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'
import ToastComp from '../../components/ToastComp'
import './index.less'

import axios from '../../utils/axios'
import { useAcountStore, useLoadingStore } from '../../stores/auth'
import { loadingDelay } from '../../utils/loading'

import { Topic } from '../../types/topic'
import { Comment } from '../../types/comment'

const TopicDetail = () => {
  const { user } = useAcountStore()
  const { loading = false, setLoading } = useLoadingStore()
  const [topic, setTopic] = useState({} as Topic)
  const [comments, setComments] = useState([] as Array<Comment>)
  const { _id } = useParams()
  const [toastBg, setToastBg] = useState('dark')
  const [toastTitle, setToastTitle] = useState('')
  const [toastMsg, setToastMsg] = useState('')
  const [toastShow, setToastShow] = useState(false)

  const topicContentRef = useRef(null)
  useEffect(() => {
    axios
      .get(`/topic/${_id}`)
      .then((res: AxiosResponse) => {
        const { data: { topic = {} } = {} } = res
        const { comments: allComments = [] } = topic
        setComments(allComments)
        setTopic(topic)

        Vditor.preview(topicContentRef?.current!, topic?.content, {
          lang: 'en_US',
          mode: 'light',
          theme: {
            current: 'light'
          }
        })
      })
      .catch(err => {
        console.error('Topic query error: ', err)
      })
  }, [_id])

  const handleCommentSubmit = async (comment: Comment) => {
    setLoading(true)
    try {
      const { data: { updatedTopic = {} } = {} } = await axios.post('/topic/comment', comment)
      setComments(comments)
      setTopic(updatedTopic)
      await loadingDelay(400)
      setLoading(false)
      handleToastShow('Success', 'Comment successfully.')
    } catch (err) {
      setLoading(false)
      console.error('Comment error: ', err)
    }
    // axios
    //   .post('/topic/comment', comment)
    //   .then((res: AxiosResponse) => {
    //     const { data: { updatedTopic = {} } = {} } = res
    //     const { comments = [] } = updatedTopic
    //     setComments(comments)
    //     setTopic(updatedTopic)
    //     await loadingDelay(400)
    //     setLoading(false)
    //     handleToastShow('Success', 'Comment successfully.')
    //   })
    //   .catch(err => {
    //     setLoading(false)
    //     console.error('err', err)
    //   })
  }

  const handleToastShow = (title: string, msg: string, bg?: Bg) => {
    setToastBg(bg || 'dark')
    setToastTitle(title)
    setToastMsg(msg)
    setToastShow(true)
  }

  return (
    <>
      <Header />
      <TopicBanner topic={topic} />

      <Container id="topicContent" className="topicContent mx-auto" ref={topicContentRef}>
        <Form.Control as="textarea" className="d-none" defaultValue={topic?.content} />
      </Container>

      {user?.username || comments.length ? (
        <Container className="topicComment mx-auto">
          {user?.username ? (
            <CommentForm
              handleCommentSubmit={handleCommentSubmit}
              handleToastShow={handleToastShow}
              loading={loading}
              topicId={_id}
            />
          ) : null}

          {comments.length
            ? comments.map(item => <CommentItem key={item?._id} comment={item} />)
            : null}
        </Container>
      ) : null}

      <ToastComp
        bg={toastBg as Bg}
        content={toastMsg}
        position="bottom-end"
        setShow={setToastShow}
        show={toastShow}
        title={toastTitle}
      />
    </>
  )
}

export default TopicDetail
