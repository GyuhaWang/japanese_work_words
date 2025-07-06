const fs = require('fs');
const path = require('path');

// 원본 데이터 읽기
const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data.json'), 'utf8'));

// 변환된 데이터 배열
const convertedData = [];

// 데이터 변환
rawData.forEach((item, index) => {
  try {
    const content = JSON.parse(item.content);
    
    // 필수 데이터가 있는지 확인
    if (content.entry && 
        content.entry.members && 
        content.entry.members.length > 0 &&
        content.entry.members[0].kanji &&
        content.entry.members[0].entry_name &&
        content.entry.means &&
        content.entry.means.length > 0) {
      
      const member = content.entry.members[0];
      const mean = content.entry.means[0];
      
      convertedData.push({
        id: index + 1,
        kanji: member.kanji,
        hiragana: member.entry_name,
        korean: mean.show_mean,
        originalId: item.id
      });
    }
  } catch (error) {
    console.log(`항목 ${index} 파싱 실패:`, error.message);
  }
});

// 변환된 데이터를 파일로 저장
const outputPath = path.join(__dirname, '../public/words.json');
fs.writeFileSync(outputPath, JSON.stringify(convertedData, null, 2), 'utf8');

console.log(`변환 완료! 총 ${convertedData.length}개의 단어가 변환되었습니다.`);
console.log(`저장 위치: ${outputPath}`);

// 샘플 데이터 출력
console.log('\n샘플 데이터:');
console.log(JSON.stringify(convertedData.slice(0, 3), null, 2)); 