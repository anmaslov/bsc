json.array!(@promos) do |promo|
  json.extract! promo, :id
  json.url promo_url(promo, format: :json)
end
