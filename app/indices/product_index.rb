ThinkingSphinx::Index.define :product, :with => :active_record do
  # fields
  where "is_active = true AND updated_price_at IS NOT NULL AND updated_price_at > (NOW() - INTERVAL 2 MONTH)"

  # .where("updated_price_at IS NOT NULL AND updated_price_at > ?", (DateTime.now - 2.months))

  indexes title, :sortable => true
  indexes is_active
  indexes description
  indexes article
  indexes content
  indexes keywords
  indexes updated_price_at
end