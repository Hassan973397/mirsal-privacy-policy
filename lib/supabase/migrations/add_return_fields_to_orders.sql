-- Migration: Add return-related fields to orders table
-- Date: 2025-11-28
-- Description: Add fields for tracking return delivery process

-- Add return_delivery_method column
-- Values: 'direct' (direct to merchant), 'pickup_agent' (via pickup agent)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS return_delivery_method text;

-- Add return_pickup_agent_scanned_at column
-- Timestamp when pickup agent scanned the barcode for return
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS return_pickup_agent_scanned_at timestamptz;

-- Add return_merchant_scanned_at column
-- Timestamp when merchant scanned the barcode to confirm return receipt
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS return_merchant_scanned_at timestamptz;

-- Add return_delivery_error column
-- Any errors encountered during return delivery process
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS return_delivery_error text;

-- Add comment for documentation
COMMENT ON COLUMN public.orders.return_delivery_method IS 'Method of return delivery: direct (to merchant) or pickup_agent (via pickup agent)';
COMMENT ON COLUMN public.orders.return_pickup_agent_scanned_at IS 'Timestamp when pickup agent scanned barcode for return';
COMMENT ON COLUMN public.orders.return_merchant_scanned_at IS 'Timestamp when merchant scanned barcode to confirm return receipt';
COMMENT ON COLUMN public.orders.return_delivery_error IS 'Errors encountered during return delivery process';

