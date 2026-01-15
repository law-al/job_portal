local KEY = KEYS[1]
local LIMIT = tonumber(ARGV[1])
local WINDOW = tonumber(ARGV[2])


local current = tonumber(redis.call('GET', KEY))

if current and current >= LIMIT then
  return 0 -- Denied request
end

current = redis.call('INCR', KEY) -- Increment the counter

if tonumber(current) == 1 then -- If the counter is 1, set the expiration time
  redis.call('EXPIRE', KEY, WINDOW) -- Set the expiration time
end

return 1 -- Allowed request
