import { auth } from "@clerk/nextjs/server";

const Test = async () => {
  const { getToken } = await auth();
  const token = await getToken({
    template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE,
  });
  if (!token) {
    return (
      <div className="p-4 border border-yellow-500 bg-yellow-50 text-yellow-700 rounded-md">
        <h1 className="font-bold">Chưa xác thực</h1>
        <p>Vui lòng đăng nhập để kiểm tra các API.</p>
      </div>
    );
  }

  try {
    const [res, resOrder, resPayment] = await Promise.all([
      fetch("http://localhost:8000/api/v1/protected", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:8001/api/v1/protected", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:8002/api/v1/protected", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const results = {
      product: {
        status: res.status,
        data: res.ok
          ? await res.json()
          : await res.json().catch(() => ({ error: "Failed" })),
      },
      order: {
        status: resOrder.status,
        data: resOrder.ok
          ? await resOrder.json()
          : await resOrder.json().catch(() => ({ error: "Failed" })),
      },
      payment: {
        status: resPayment.status,
        data: resPayment.ok
          ? await resPayment.json()
          : await resPayment.json().catch(() => ({ error: "Failed" })),
      },
    };

    const hasError = !res.ok || !resOrder.ok || !resPayment.ok;

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Kết quả kiểm tra Microservices</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(results).map(([name, result]) => (
            <div
              key={name}
              className={`p-4 rounded-lg border ${
                result.status === 200
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <h2 className="font-bold capitalize">{name} Service</h2>
              <p className="text-sm mb-2">Status: {result.status}</p>
              <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        {hasError && (
          <div className="p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-md">
            <p>
              Lưu ý: Một hoặc nhiều dịch vụ trả về lỗi. Vui lòng kiểm tra log
              backend.
            </p>
          </div>
        )}
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
