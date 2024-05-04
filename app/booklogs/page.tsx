import prisma from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

const Page = async () => {
  const booklog = await prisma.booklog.findMany();

  return (
    <div className="m-8">
      <h1 className="text-xl font-bold">BOOKLOG一覧</h1>
      <div class="h-96 overflow-scroll">
        <table className="table-auto">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-200">
              <th className="sticky left-0  bg-white border">ISBN13</th>
              <th className="px-4 py-2 border">書名</th>
              <th className="px-4 py-2 border">著者名</th>
              <th className="px-4 py-2 border">発行</th>
              <th className="px-4 py-2 border">分類</th>
            </tr>
          </thead>
          <tbody>
            {booklog.map((booklog) => (
              <tr key={booklog.isbn13}>
                <td className=" px-4 py-2 sticky left-0 z-[2] bg-slate-100 border ">
                  <Link href={`/booklogs/${booklog.isbn13}`}>{booklog.isbn13}</Link>
                </td>
                <td className=" px-4 py-2 border">{booklog.bookname}</td>
                <td className=" px-4 py-2 border">{booklog.author}</td>
                <td className=" px-4 py-2 border">{booklog.publisher}</td>
                <td className=" px-4 py-2 border">{booklog.genre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="flex items-center mt-4"
        action={async (data: FormData) => {
          'use server';
          const isbn13 = data.get('isbn13') as string;
          const bookname = data.get('bookname') as string;
          const getdate = new Date('2000-01-01');
          const readdate = new Date('2000-01-01');
          await prisma.booklog.create({ data: { isbn13, bookname , getdate, readdate } });
          revalidatePath('/booklogs');
        }}
      >
        <label htmlFor="isbn13">ISBN13:</label>
        <input type="text" name="isbn13" className="border mx-2 p-1" />
        <label htmlFor="bookname">書名:</label>
        <input type="text" name="bookname" className="border mx-2 p-1" />
        <button
          type="submit"
          className="bg-blue-600 px-2 py-1 rounded-lg text-sm text-white"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default Page;
