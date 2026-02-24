-- تشغيل نظام الحماية (RLS) - ده مش هيعمل مشكلة لو اشتغل مرتين
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- 1. سياسات جدول الوظائف (Jobs)
-- نمسح السياسة القديمة لو موجودة عشان نتجنب الأخطاء
DROP POLICY IF EXISTS "Enable all access for jobs" ON jobs;

-- نعمل السياسة الجديدة
CREATE POLICY "Enable all access for jobs" 
ON jobs FOR ALL 
USING (true) 
WITH CHECK (true);

-- 2. سياسات جدول التقديمات (Applications)
-- نمسح السياسة القديمة لو موجودة
DROP POLICY IF EXISTS "Enable insert for everyone" ON applications;
DROP POLICY IF EXISTS "Enable read access for applications" ON applications;

-- السماح للجميع بالتقديم (INSERT)
CREATE POLICY "Enable insert for everyone" 
ON applications FOR INSERT 
WITH CHECK (true);

-- السماح بقراءة التقديمات (Select)
CREATE POLICY "Enable read access for applications" 
ON applications FOR SELECT 
USING (true);
