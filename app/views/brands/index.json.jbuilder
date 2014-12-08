json.array!(@brands) do |brand|
  json.extract! brand, :id, :title, :description, :content
  json.url brand_url(brand, format: :json)
end
