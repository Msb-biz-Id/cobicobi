{!! '<'.'?xml version="1.0" encoding="UTF-8"?>' !!}
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[{{ $title }}]]></title>
    <atom:link href="{{ $feedUrl }}" rel="self" type="application/rss+xml" />
    <link>{{ $siteUrl }}</link>
    <description><![CDATA[{{ $description }}]]></description>
    <lastBuildDate>{{ $lastBuildDate }}</lastBuildDate>
    <language>id-ID</language>
    <generator>{{ config('app.name', 'CMS Portal Kampus') }}</generator>

    @foreach ($items as $item)
    <item>
      <title><![CDATA[{{ $item['title'] }}]]></title>
      <link>{{ $item['link'] }}</link>
      <guid isPermaLink="true">{{ $item['link'] }}</guid>
      <dc:creator><![CDATA[{{ $item['author'] ?? config('app.name') }}]]></dc:creator>
      <pubDate>{{ $item['pubDate'] }}</pubDate>
      @if (!empty($item['category']))
      <category><![CDATA[{{ $item['category'] }}]]></category>
      @endif
      <description><![CDATA[{{ $item['description'] }}]]></description>
      @if (!empty($item['content']))
      <content:encoded><![CDATA[{!! $item['content'] !!}]]></content:encoded>
      @endif
      @if (!empty($item['enclosureUrl']))
      <enclosure url="{{ $item['enclosureUrl'] }}" type="{{ $item['enclosureType'] ?? 'image/jpeg' }}" length="0" />
      @endif
    </item>
    @endforeach
  </channel>
</rss>
