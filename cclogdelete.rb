Encoding.default_external = 'UTF-8'
STDOUT.sync = true;

begin
  filename = ARGV[0];

  regexp  = /cc\.log(?<paren>\((?:[^()]|\g<paren>)*\)[\s\;]?)/m
  replace = ''

  File.open(filename, "r") do |file|
    puts file.read.gsub(regexp, replace)
  end

rescue => ex
  print ex.class
  print ex.message
  print ex.backtrace
end
