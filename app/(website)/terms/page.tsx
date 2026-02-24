import React from 'react';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-black text-[#1A3B5F] mb-8 text-center">الشروط والأحكام</h1>

            <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6 text-gray-700 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-[#00A3A3] mb-4">1. قبول الشروط</h2>
                    <p>
                        باستخدامك لمنصة "جاهز"، فإنك توافق على الامتثال لهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام الموقع.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-[#00A3A3] mb-4">2. استخدام المنصة</h2>
                    <p>
                        المنصة مصممة لتسهيل عملية الربط بين الباحثين عن عمل وأصحاب العمل. يُمنع استخدام المنصة لأي أغراض غير قانونية أو لنشر محتوى ضار أو مسيء.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-[#00A3A3] mb-4">3. حقوق الملكية الفكرية</h2>
                    <p>
                        جميع حقوق الملكية الفكرية المرتبطة بمحتوى وتصميم الموقع محفوظة لمنصة "جاهز". لا يجوز نسخ أو إعادة استخدام أي جزء دون إذن كتابي مسبق.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-[#00A3A3] mb-4">4. إخلاء المسؤولية</h2>
                    <p>
                        نحن نسعى لضمان دقة وتحديث المعلومات على المنصة، لكننا لا نتحمل المسؤولية عن أي أخطاء أو خسائر ناتجة عن استخدام هذه المعلومات أو الاعتماد عليها.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-[#00A3A3] mb-4">5. التعديلات</h2>
                    <p>
                        نحتفظ بالحق في تعديل هذه الشروط في أي وقت. يعتبر استمرار استخدامك للموقع بعد نشر التعديلات موافقة صريحة منك عليها.
                    </p>
                </section>
            </div>
        </div>
    );
}
