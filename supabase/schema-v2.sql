-- SARKARI ALERT V2 - COMPLETE SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('super_admin','admin','editor','user')),
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  avatar_url TEXT,
  verify_token TEXT,
  reset_token TEXT,
  reset_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADMIN LOGS
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LOGIN LOGS
CREATE TABLE IF NOT EXISTS login_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SESSIONS
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

INSERT INTO categories (name,slug,icon,color,sort_order) VALUES
('Central Govt','central','🏛️','#f59e0b',1),
('State Govt','state','🏢','#10b981',2),
('Railway','railway','🚂','#3b82f6',3),
('Banking','banking','🏦','#8b5cf6',4),
('Teaching','teaching','📚','#ec4899',5),
('Defence','defence','⚔️','#ef4444',6),
('SSC','ssc','📋','#f97316',7),
('UPSC','upsc','🎯','#06b6d4',8),
('PSC','psc','🏛️','#84cc16',9)
ON CONFLICT (slug) DO NOTHING;

-- STATES
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true
);

INSERT INTO states (name,slug) VALUES
('All India','all-india'),('Uttar Pradesh','uttar-pradesh'),
('Bihar','bihar'),('Rajasthan','rajasthan'),
('Madhya Pradesh','madhya-pradesh'),('Maharashtra','maharashtra'),
('Delhi','delhi'),('Haryana','haryana'),('Punjab','punjab'),
('Gujarat','gujarat'),('Karnataka','karnataka'),
('Tamil Nadu','tamil-nadu'),('West Bengal','west-bengal'),
('Uttarakhand','uttarakhand'),('Himachal Pradesh','himachal-pradesh'),
('Jharkhand','jharkhand'),('Odisha','odisha'),
('Assam','assam'),('Chhattisgarh','chhattisgarh')
ON CONFLICT (slug) DO NOTHING;

-- JOBS
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  state_id UUID REFERENCES states(id),
  total_posts TEXT,
  salary_min BIGINT DEFAULT 0,
  salary_max BIGINT DEFAULT 0,
  salary_text TEXT,
  qualification TEXT,
  age_text TEXT,
  last_date DATE NOT NULL,
  exam_date TEXT,
  apply_link TEXT,
  notification_pdf TEXT,
  official_website TEXT,
  selection_process TEXT,
  description TEXT,
  short_desc TEXT,
  notify_text TEXT DEFAULT 'Apply Now',
  is_new BOOLEAN DEFAULT true,
  is_hot BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  is_sponsored BOOLEAN DEFAULT false,
  views INT DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  source_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADMIT CARDS
CREATE TABLE IF NOT EXISTS admit_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  release_date DATE,
  exam_date TEXT,
  download_link TEXT,
  details TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RESULTS
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  release_date DATE,
  download_link TEXT,
  details TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANSWER KEYS
CREATE TABLE IF NOT EXISTS answer_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  release_date DATE,
  download_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SYLLABUS
CREATE TABLE IF NOT EXISTS syllabus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  pdf_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PREVIOUS YEAR PAPERS
CREATE TABLE IF NOT EXISTS previous_papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  year INT,
  exam_name TEXT,
  pdf_url TEXT,
  description TEXT,
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  downloads INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NEWS
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT,
  external_link TEXT,
  image_url TEXT,
  is_urgent BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  views INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CURRENT AFFAIRS
CREATE TABLE IF NOT EXISTS current_affairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  topic TEXT,
  month TEXT,
  year INT,
  difficulty TEXT DEFAULT 'medium',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT,
  tags TEXT[],
  cover_image TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  views INT DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EXAM CALENDAR
CREATE TABLE IF NOT EXISTS exam_calendar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  exam_date DATE NOT NULL,
  category TEXT,
  link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOOKMARKS
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- ALERTS
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  categories TEXT[] DEFAULT '{}',
  states TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  telegram_id TEXT,
  push_subscription JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WHATSAPP SUBSCRIBERS
CREATE TABLE IF NOT EXISTS whatsapp_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  categories TEXT[] DEFAULT '{}',
  states TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PREMIUM MEMBERSHIPS
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL CHECK (plan_name IN ('monthly','yearly')),
  amount INT NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','expired','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount INT NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','success','failed','refunded')),
  type TEXT DEFAULT 'resume' CHECK (type IN ('resume','premium_monthly','premium_yearly','sponsored_job','other')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RESUME TEMPLATES
CREATE TABLE IF NOT EXISTS resume_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  preview_image TEXT,
  is_free BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  price INT DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO resume_templates (name,is_free,price,sort_order) VALUES
('Classic',true,0,1),('Modern',false,10,2),
('Professional',false,10,3),('ATS Friendly',false,10,4),
('Government Style',false,10,5)
ON CONFLICT DO NOTHING;

-- RESUME DOWNLOADS
CREATE TABLE IF NOT EXISTS resume_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  template_id UUID REFERENCES resume_templates(id),
  payment_id UUID REFERENCES payments(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUTOMATION QUEUE
CREATE TABLE IF NOT EXISTS automation_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  data JSONB NOT NULL,
  source_url TEXT,
  type TEXT DEFAULT 'job' CHECK (type IN ('job','news','admit_card','result','answer_key')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SOURCES
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'rss' CHECK (type IN ('rss','api','website')),
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  last_checked TIMESTAMPTZ,
  check_interval INT DEFAULT 120,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO sources (name,url,type,category) VALUES
('Employment News','https://www.employmentnews.gov.in/rss','rss','general'),
('UPSC','https://www.upsc.gov.in/rss','rss','upsc'),
('SSC','https://ssc.nic.in/rss','rss','ssc')
ON CONFLICT DO NOTHING;

-- PAGE VIEWS
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT NOT NULL,
  job_id UUID,
  referer TEXT,
  country TEXT,
  device TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADS
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  adsense_slot_id TEXT,
  position TEXT NOT NULL,
  custom_html TEXT,
  is_active BOOLEAN DEFAULT true,
  clicks INT DEFAULT 0,
  impressions INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO ads (name,position,is_active) VALUES
('Header Banner','header',true),
('Sidebar Top','sidebar_top',true),
('Between Jobs','between_jobs',true),
('Job Detail Top','job_detail_top',true),
('Footer Banner','footer',true)
ON CONFLICT DO NOTHING;

-- AD REQUESTS
CREATE TABLE IF NOT EXISTS ad_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  budget TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','contacted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SPONSORED JOBS
CREATE TABLE IF NOT EXISTS sponsored_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT,
  apply_link TEXT,
  plan TEXT CHECK (plan IN ('basic','standard','premium')),
  amount INT,
  payment_id UUID REFERENCES payments(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','published','rejected','expired')),
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  icon TEXT,
  url TEXT,
  type TEXT DEFAULT 'general',
  sent_count INT DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO SETTINGS
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO seo_settings (key,value) VALUES
('site_name','SarkariAlert'),
('site_description','India ki #1 Sarkari Naukri website.'),
('site_keywords','sarkari naukri, govt jobs, SSC, Railway, UPSC'),
('og_image','/og-image.jpg'),
('google_verification',''),
('adsense_id',''),
('ga_id',''),
('razorpay_key','')
ON CONFLICT (key) DO NOTHING;

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_jobs_slug ON jobs(slug);
CREATE INDEX IF NOT EXISTS idx_jobs_published ON jobs(is_published,is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_last_date ON jobs(last_date);
CREATE INDEX IF NOT EXISTS idx_jobs_views ON jobs(views DESC);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_phone ON whatsapp_subscribers(phone);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id,status);
CREATE INDEX IF NOT EXISTS idx_papers_category ON previous_papers(category,year);

-- FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at=NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_jobs_updated BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_news_updated BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION disable_expired_jobs() RETURNS void AS $$
BEGIN
  UPDATE jobs SET is_active=false WHERE last_date < CURRENT_DATE AND is_active=true;
  UPDATE news SET is_active=false WHERE expires_at < NOW() AND expires_at IS NOT NULL AND is_active=true;
  UPDATE memberships SET status='expired' WHERE end_date < NOW() AND status='active';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_job_views(job_slug TEXT) RETURNS void AS $$
BEGIN UPDATE jobs SET views=views+1 WHERE slug=job_slug; END;
$$ LANGUAGE plpgsql;

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public jobs" ON jobs FOR SELECT USING (is_published=true AND is_active=true);
CREATE POLICY "Public news" ON news FOR SELECT USING (is_published=true AND is_active=true);
CREATE POLICY "Public affairs" ON current_affairs FOR SELECT USING (is_active=true);
CREATE POLICY "Public papers" ON previous_papers FOR SELECT USING (is_active=true);
