import { prisma } from '@/prisma/db';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params;

  const post = await prisma.post.findFirst({
    where: {
      slug: slug as string,
    },
    include: {
      author: true,
      Comment: {
        include: {
          author: true,
        },
      },
    },
  });

  console.log('slug:', slug); // Debugging line
  console.log('post:', post); // Debugging line

  return { props: { post } };
};

const PostPage = ({ post }) => {
  // Render your post here
  return post ? <div>{post.title}</div> : <div>Post not found</div>;
};

export default PostPage;
