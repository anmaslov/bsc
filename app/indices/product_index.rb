ThinkingSphinx::Index.define :product, :with => :active_record do
  # fields
  indexes title, :sortable => true
  indexes is_active
  indexes description
  indexes article
  indexes content
  indexes keywords
end