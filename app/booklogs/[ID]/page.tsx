import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { ID: string } }) {
  const id = String(params.ID);
  const booklog = await prisma.booklog.findUnique({
    where: {
      isbn13: id,
    },
  })
  return (
    <div className="m-8">
      <Link href="/booklogs" className="bg-blue-600 px-2 py-1 rounded-lg text-sm text-white whitespace-nowrap">戻る</Link>
      <h1 className="text-xl font-bold">BOOKLOG詳細</h1>
      <form action={async (data: FormData) => {
          'use server';
          const isbn13      = data.get('isbn13') as string;
          const isbn10      = data.get('isbn10') as string;
          const bookname    = data.get('bookname') as string;
          const author      = data.get('author') as string;
          const publisher   = data.get('publisher') as string;
          const genre       = data.get('genre') as string;
          const issuedate   = data.get('issuedate');
          const getdate     = data.get('getdate');
          const readdate    = data.get('readdate');
          const ownership   = parseInt(data.get('ownership'));
          const purchase    = parseInt(data.get('purchase'));
          const library     = data.get('library') as string;
          const overview    = data.get('overview') as string;
          const impressions = data.get('impressions') as string;
          const state       = data.get('state') as string;
          await prisma.booklog.update({
            where: {
              isbn13: id,
            },
            data: {
              isbn10,
              bookname,
              author,
              publisher,
              genre,
              issuedate: new Date(issuedate.replaceAll('/', '-')),
              getdate:   new Date(getdate.replaceAll('/', '-')),
              readdate:  new Date(readdate.replaceAll('/', '-')),
              ownership,
              purchase,
              library,
              overview,
              impressions,
              state,
            },
          });
          revalidatePath('/booklogs');
          redirect('/booklogs');
        }}
      >
      <table className="table-auto">
      <tbody>
        <tr className="px-4 py-2 border">
          <th>ISBN13:</th>
          <td width={500} className="px-2 bg-gray-200" colspan="5">{booklog?.isbn13}
          <input type="hidden" name="isbn13" value={booklog?.isbn13} />
          </td>
          <th className="bg-gray-200">表　紙:</th></tr>
        <tr className="px-4 py-2 border">
          <th className="px-1 bg-gray-200">ISBN10:</th>
          <td className="px-2" colspan="5">
            <input type="number"
                   name="isbn10"
                   defaultValue={`${booklog?.isbn10}`}
                   size="7"
                   min="1000000000"
                   max="9999999999"
            />
          </td>
          <td rowspan="13">
            <Image
              height={500}
              width={300}
              src={`https://images-fe.ssl-images-amazon.com/images/P/${booklog?.isbn10}.09.LZZZZZZZ`}
            /></td></tr>
        <tr className="px-4 py-2 border">
          <th className="bg-gray-200">書　名:</th>
          <td className="px-2" colspan="5">
            <input type="text" name="bookname" defaultValue={`${booklog?.bookname}`} size="50" />
          </td></tr>
        <tr className="px-4 py-2 border">
          <th className="bg-gray-200">著　者:</th>
          <td className="px-2" colspan="5">
            <input type="text" name="author" defaultValue={`${booklog?.author}`} size="25" />
          </td></tr>
        <tr className="px-4 py-2 border">
          <th className="bg-gray-200">出版社:</th>
          <td className="px-2" colspan="5">
            <input type="text" name="publisher" defaultValue={`${booklog?.publisher}`} size="25" />
          </td></tr>
        <tr className="px-4 py-2 border">
          <th className="bg-gray-200">分　野:</th>
          <td className="px-2" colspan="5">
            <input type="text" name="genre" defaultValue={`${booklog?.genre}`} size="25" />
          </td></tr>
        <tr className="px-4 py-2 border">
          <th className="bg-gray-200">発行日:</th>
          <td className="px-2">
            <input type="text" name="issuedate" size="10"
             defaultValue={`${booklog?.issuedate.toLocaleDateString()}`} /></td>
          <th className="bg-gray-200">取得日:</th>
          <td className="px-2">
            <input type="text" name="getdate" size="10"
             defaultValue={`${booklog?.getdate.toLocaleDateString()}`} /></td>
          <th className="bg-gray-200">読了日:</th>
          <td className="px-2">
            <input type="text" name="readdate" size="10"
             defaultValue={`${booklog?.readdate.toLocaleDateString()}`} /></td>
          </tr>
        <tr className="px-4 py-2 border">
          <th className="bg-gray-200">所　有:</th>
          <td className="px-2" colspan="5">
            <input type="number" name="ownership" min="0" max="1"
             defaultValue={`${booklog?.ownership}`} />
            　0:非所有　1:所有
          </td></tr>
        <tr className="px-4 py-2 border">
          <th className="bg-gray-200">価　格:</th>
          <td className="px-2" colspan="5">
            <input type="number" name="purchase" defaultValue={`${booklog?.purchase}`} />
          </td></tr>
        <tr className="px-4 py-2 border">
          <th className="bg-gray-200">図書館:</th>
          <td className="px-2" colspan="5">
            <input type="text" name="library" defaultValue={`${booklog?.library}`} size="25" />
          </td></tr>
        <tr className="px-4 py-2 border">
          <th className="bg-gray-200">概　要:</th>
          <td className="px-2" colspan="5">
            <textarea name="overview" cols="62">{booklog?.overview}</textarea>
          </td></tr>
        <tr className="px-4 py-2 border">
          <th className="bg-gray-200">感　想:</th>
          <td className="px-2" colspan="5">
            <textarea name="impressions" cols="62">{booklog?.impressions}</textarea>
          </td></tr>
        <tr className="px-4 py-2 border">
          <th className="bg-gray-200">状　態:</th>
          <td className="px-2" colspan="5">
            <input type="text" name="state" defaultValue={`${booklog?.state}`} size="10" />
          </td></tr>
      </tbody>
      </table>
      <button type="submit"
        className="bg-green-500 my-4 px-2 py-1 rounded-lg text-sm text-white">
        更新
      </button>
      </form>

      <form action={async (data: FormData) => {
          'use server';
          const isbn13 = data.get('isbn13') as string;
          await prisma.booklog.delete({ where: { isbn13 } });
          redirect('/booklogs');
        }}
      >
        <input type="hidden" name="isbn13" value={booklog?.isbn13} />
        <button type="submit"
          className="bg-red-500 px-2 py-1 rounded-lg text-sm text-white whitespace-nowrap">
          削除
        </button>
      </form>

    </div>
  );
}

