json.array!(@compare_items) do |compare_item|
  json.extract! compare_item, :id, :product_id, :cart_id
  json.url compare_item_url(compare_item, format: :json)
end
