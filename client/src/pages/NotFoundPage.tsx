import React from 'react'
import { Layout } from 'src/components/ui/Layout/layout/Layout'
import { ErrorMessage } from 'src/components/ui/statuses/ErrorMessage'

interface IProps {
  
}

export const NotFoundPage: React.FC<IProps> = ({}) => {
  
  return (
    <Layout title="404">
      <ErrorMessage message='404. Страница не найдена' />
    </Layout>
  )
}