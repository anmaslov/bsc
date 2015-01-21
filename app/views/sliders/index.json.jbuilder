json.array!(@sliders) do |slider|
  json.extract! slider, :id, :title, :link
  json.url slider_url(slider, format: :json)
end
