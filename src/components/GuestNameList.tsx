'use client';

import { useRouter } from 'next/navigation';

interface GuestNameListProps {
  generatedUrls: string[];
}

const GuestNameList: React.FC<GuestNameListProps> = ({ generatedUrls }) => {
  const router = useRouter();

  const handleNavigate = (url: string) => {
    router.push(url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Undangan</h1>
      <ul className="space-y-4 w-full max-w-md">
        {generatedUrls.map((url, index) => (
          <li key={index}>
            <button
              onClick={() => handleNavigate(url)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              {url}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuestNameList;
