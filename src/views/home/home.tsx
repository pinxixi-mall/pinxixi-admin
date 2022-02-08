import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react'

const Home: React.FC = (props: any) => {
  useEffect(() => {
  }, [])
  return (
    <>
      Home
    </>
  )
}

export default inject('LayoutStore')(observer(Home))