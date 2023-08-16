import { random } from '../utils';

// eslint-disable-next-line import/prefer-default-export
export const getPosts = () =>
  Array.from({ length: 15 }).map(() => ({
    _id: Math.random().toString(32).substring(2),
    title: random([
      '投稿の例',
      '学年通信○○号',
      '自転車ヘルメット努力義務化',
      '卒業式について',
      '入学式について',
    ]),
    attachments: [
      {
        id: 'hato_post_attachment',
        name: '資料1.pdf',
        fileType: 'application/pdf',
        url: 'https://demo.hato.cf/資料1.pdf',
      },
    ],
    tags: [
      random([
        {
          label: '校内',
          value: 'private',
          color: '',
        },
        {
          label: '校外',
          value: 'public',
          color: '',
        },
      ]),
    ],
    contact: 'post-contact@example.com',
    owner: '屋代 太郎',
    createdAt: '2022-01-10T15:00:00.000Z',
  }));
