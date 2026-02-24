import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-black text-[#1A3B5F] mb-8 text-center">سياسة الخصوصية</h1>

            <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6 text-gray-700 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-[#00A3A3] mb-4">1. جمع المعلومات</h2>
                    <p>
                        نحن نقوم بجمع المعلومات التي تقدمها لنا مباشرة، مثل الاسم، البريد الإلكتروني، رقم الهاتف، والبيانات المهنية (مثل السيرة الذاتية) عندما تقوم بالتسجيل في منصتنا أو التقديم على وظيفة.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-[#00A3A3] mb-4">2. استخدام المعلومات</h2>
                    <p>
                        نستخدم المعلومات التي نجمعها لتقديم خدماتنا وتحسينها، وكذلك لتسهيل عملية التوظيف وربط الشركات بالمرشحين المناسبين.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-[#00A3A3] mb-4">3. حماية البيانات</h2>
                    <p>
                        نحن نتخذ تدابير أمنية متقدمة لحماية بياناتك الشخصية من الوصول غير المصرح به، التدمير، أو التعديل.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-[#00A3A3] mb-4">4. مشاركة المعلومات</h2>
                    <p>
                        لا نقوم ببيع أو تأجير معلوماتك الشخصية لأطراف ثالثة. تتم مشاركة بياناتك فقط مع الشركات التي تتقدم لفرص العمل لديها وبموافقتك.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-[#00A3A3] mb-4">5. التغييرات على سياسة الخصوصية</h2>
                    <p>
                        قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم نشر الحجم المعدل على هذه الصفحة وندعوك لمراجعتها بشكل دوري.
                    </p>
                </section>
            </div>
        </div>
    );
}
