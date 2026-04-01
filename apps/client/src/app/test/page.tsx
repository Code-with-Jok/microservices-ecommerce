import { auth } from "@clerk/nextjs/server";

const Test = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  try {
    const res = await fetch("http://localhost:8000/api/v1/protected", {
      cache: "no-store", // Ensure we get fresh data
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resOrder = await fetch("http://localhost:8001/api/v1/protected", {
      cache: "no-store", // Ensure we get fresh data
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resPayment = await fetch("http://localhost:8002/api/v1/protected", {
      cache: "no-store", // Ensure we get fresh data
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("res", res);
    console.log("resOrder", resOrder);
    console.log("resPayment", resPayment);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("API Error:", errorData);
      return (
        <div className="p-4 border border-red-500 bg-red-50 text-red-700 rounded-md">
          <h1 className="font-bold">Lỗi API: {res.status}</h1>
          <p>{errorData.error || "Không thể lấy dữ liệu từ server."}</p>
        </div>
      );
    }

    const data = await res.json();
    return (
      <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-500">
        <h1 className="font-bold">Dữ liệu từ API:</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    console.error("Fetch Error:", error);
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700 rounded-md">
        <h1 className="font-bold">Lỗi Kết Nối</h1>
        <p>Không thể kết nối đến server (Backend có thể chưa chạy).</p>
      </div>
    );
  }
};

export default Test;
