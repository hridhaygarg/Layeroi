-- Create outreach_queue table for prospect research and message generation automation
CREATE TABLE IF NOT EXISTS outreach_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Prospect Information
  prospect_name TEXT NOT NULL,
  prospect_title TEXT,
  prospect_email TEXT NOT NULL UNIQUE,
  company_name TEXT,
  company_size TEXT,
  company_industry TEXT,
  company_website TEXT,

  -- Research Data
  research_data JSONB, -- Stores company info, tech stack, recent news, etc.
  icp_score DECIMAL(3,2), -- 0-1.0 score for Ideal Customer Profile match
  fit_reason TEXT, -- Why this prospect matches our ICP

  -- Message Generation
  personalized_message TEXT,
  message_generated_at TIMESTAMP WITH TIME ZONE,
  message_version INTEGER DEFAULT 1,

  -- Status Tracking
  status TEXT DEFAULT 'pending', -- pending, queued, sent, replied, unsubscribed, failed
  status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Email Tracking
  email_sent_at TIMESTAMP WITH TIME ZONE,
  email_opened_at TIMESTAMP WITH TIME ZONE,
  email_clicked_at TIMESTAMP WITH TIME ZONE,

  -- Follow-up Tracking
  follow_up_queued_at TIMESTAMP WITH TIME ZONE,
  follow_up_sent_at TIMESTAMP WITH TIME ZONE,
  follow_up_message TEXT,

  -- Engagement Metrics
  response_received_at TIMESTAMP WITH TIME ZONE,
  engagement_notes TEXT,

  -- Metadata
  source TEXT DEFAULT 'apollo', -- apollo, manual, import, etc.
  queue_week TEXT NOT NULL, -- Format: YYYY-WXX (e.g., 2024-W16)
  attempt_count INTEGER DEFAULT 0,
  last_error TEXT,

  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_outreach_status ON outreach_queue(status);
CREATE INDEX idx_outreach_queue_week ON outreach_queue(queue_week);
CREATE INDEX idx_outreach_email ON outreach_queue(prospect_email);
CREATE INDEX idx_outreach_created ON outreach_queue(created_at DESC);
CREATE INDEX idx_outreach_sent ON outreach_queue(email_sent_at DESC);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_outreach_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_outreach_updated_at
  BEFORE UPDATE ON outreach_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_outreach_updated_at();

-- Create view for weekly stats
CREATE OR REPLACE VIEW outreach_stats AS
SELECT
  queue_week,
  COUNT(*) as total_prospects,
  COUNT(CASE WHEN status = 'queued' THEN 1 END) as queued_count,
  COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_count,
  COUNT(CASE WHEN email_opened_at IS NOT NULL THEN 1 END) as opened_count,
  COUNT(CASE WHEN response_received_at IS NOT NULL THEN 1 END) as replied_count,
  ROUND(COUNT(CASE WHEN email_opened_at IS NOT NULL THEN 1 END)::DECIMAL /
        COUNT(CASE WHEN status = 'sent' THEN 1 END) * 100, 2) as open_rate,
  ROUND(COUNT(CASE WHEN response_received_at IS NOT NULL THEN 1 END)::DECIMAL /
        COUNT(CASE WHEN status = 'sent' THEN 1 END) * 100, 2) as reply_rate
FROM outreach_queue
WHERE status IN ('sent', 'replied')
GROUP BY queue_week
ORDER BY queue_week DESC;
