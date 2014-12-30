json.array!(@compares) do |compare|
  json.extract! compare, :id
  json.url compare_url(compare, format: :json)
end
